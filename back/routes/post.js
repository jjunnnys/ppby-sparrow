const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // 파일시스템을 조작

const { Post, Comment, Image, User, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');
const db = require('../models');

const router = Router();

// uploads 폴더 생성
try {
  fs.accessSync('uploads');
} catch (error) {
  console.log('uploads 폴더가 없으므로 생성합니다.');
  fs.mkdirSync('uploads');
}

// multer는 라우터마다 별도의 세팅을 해주는 것이 좋다. (게시글마다 폼 전송이 다 다르기 떄문에)
const upload = multer({
  // 저장할 곳 (일단 클라우드 연결 전엔 하드웨어에 저장, s3 서비스)
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) {
      // 노드에서는 파일명이 겹칠 때 이전 데이터에 덮어씌우기 떄문에 앞에 쓴 사람이 피해를 볼 수 있음
      // 파일명 안 겹치게 만든다.
      // 파일명 뒤에 업로드 시간을 붙혀 줌(1ms 단위)
      // ppby.png
      const ext = path.extname(file.originalname); // 확장자 추출(.png)
      const basename = path.basename(file.originalname, ext); // 이름 추출(ppby)
      done(null, basename + '_' + new Date().getTime() + ext); // ppby312412412352.png
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB 로 제한
  // !! 왠만하면 파일은 백엔드 서버를 거치지 않고 바로 클라우드로 전송하는 것이 좋다. (대규모일 경우)
});

/* 게시글 작성 */
// POST /post
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    // 프론트에서 생성한 게시글이 post 에 객체로 담긴다.
    const post = await Post.create({
      image: req.body.image, // formData로 넘어 옴
      content: req.body.content, // 이름을 잘 맞춰 줘야 한다.
      UserId: req.user.id, // deserialize를 통해 req.user가 생성
    });

    if (hashtags) {
      const result = await Propmise.all(
        hashtags.map(
          // 기존에 해쉬태그가 있으면 가져오고 없으면 등록
          (tag) =>
            Hashtag.findOrCreate({
              whrere: { name: tag.slice(1).toLowerCase() },
            }) // slice(1)은 해쉬태그(#)를 때버린다(대문자로 검색하나 소문자로 검색하나 검색이 되기 위해서 DB에 소문자로 통일해서 저장)
        )
      );
      // result 값이 [#노드,true], [#리액트,true] -> 뒤에는 생성됐는지 가져 왔는지 알려 줌
      await post.addHashtags(result.map((v) => v[0]));
    }

    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        // 이미지를 여러 개 올리면 image: [ppby.png, ppby1.png] 배열형태로 들어 감
        const images = await Promise.all(
          req.body.image.map((image) => Image.create({ src: image }))
        );
        // -> 프로미스 배열이 된다. ppby.create 프로미스, ppby1.create 프로미스 -> 한방에 Promise.all로 한방에 저장(한 컬럼에)
        // -> DB에는 파일 주소만 가지고 있다. 파일은 클라우드에 저장 (캐싱으로 속도도 향상된다.)
        await post.addImages(images);
      } else {
        // 이미지를 하나만 올리면 image: ppby.png
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }

    // 정보 완성하기
    const fullPost = await Post.findOne({
      where: { id: post.id }, // 방금 등록한 post.id 가져오고
      include: [
        {
          model: Image, // 이미지 post.Images 로 알아서 들어간다.
        },
        {
          model: Comment, // 댓글
          include: [
            {
              model: User, // 댓글 작성자
              attributes: ['id', 'nickname'],
            },
          ],
        },
        {
          model: User, // 게시글 작성자
          attributes: ['id', 'nickname'],
        },
        {
          model: User, // 좋아요 누른 사람
          as: 'Likers', // 다른 User와 구별이 된다.
          attributes: ['id'],
        },
      ],
    });
    res.status(201).json(fullPost); // 잘 생성 되고(모든 참조하는 데이터 넣은 다음) 프론트에 돌려 줌
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/* 이미지 업로드 */
// POST /post/images
router.post(
  '/images',
  isLoggedIn,
  upload.array('image'), // 이미지를 여러장 올릴 수 있게 하기 위해 array, 한장이면 single, 파일이 아닌 그냥 JSON이면 none(), 파일 input이 여러 개면 fields
  (req, res, next) => {
    console.log(req.files); // 업로드된 이미지 정보가 들어 있음
    res.status(200).json(req.files.map((v) => v.filename));
  }
);

/* 댓글 작성 */
// POST /1/comment
router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  try {
    // 악성 사용자를 대비해서 확실하게 게시글이 있는지 확인한다.
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.'); // 금지
    }

    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10), // params에 들어가기 때문에 문자열이 들어가서 오류 발생, 숫자로 바꾼다.
      UserId: req.user.id,
    });

    // 댓글의 모든 정보를 담아서 보내준다.
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ['id', 'nickname'],
        },
      ],
    });
    res.status(201).json(fullComment); // 잘 생성 되고 프론트에 돌려 줌
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// PATCH /post/1/like
router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
  // !! 항상 데이터먼저 검사하기
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status.send('게시글이 존재하지 않습니다.');
    }
    await post.addLikers(req.user.id); // 시퀄라이져 메소드 활용
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// DELETE /post/1/like
router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status.send('게시글이 존재하지 않습니다.');
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// DELETE /post/10
router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    // 시퀄라이즈에서는 제거할 때 destroy를 쓴다.
    await Post.destroy({
      where: {
        id: req.params.postId,
        // postId만 바꾸면 게시글을 삭제할 수 있으므로 보안 강화 (작성하고 삭제하는 건 보안 철저히)
        UserId: req.user.id, // 게시글의 userId
      },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) }); // parmas는 문자열이라서 id는 숫자이기 떄문에 바꿔준다.
  } catch (error) {
    console.error(error);
    next(error);
  }
  res.json({ id: 1 });
});

module.exports = router;
