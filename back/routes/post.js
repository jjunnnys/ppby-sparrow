const { Router } = require('express');

const { Post, Comment, Image, User } = require('../models');
const { isLoggedIn } = require('./middlewares');
const db = require('../models');

const router = Router();

router.post('/', isLoggedIn, async (req, res, next) => {
  // POST /post
  try {
    // 프론트에서 생성한 게시글이 post 에 객체로 담긴다.
    const post = await Post.create({
      content: req.body.content, // 이름을 잘 맞춰 줘야 한다.
      UserId: req.user.id, // deserialize를 통해 req.user가 생성
    });
    // 정보 완성하기
    const fullPost = await Post.findOne({
      where: { id: post.id }, // 방금 등록한 post.id 가져오고
      include: [
        {
          model: Image, // 이미지
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

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  // POST /post
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
