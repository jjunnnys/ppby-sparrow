const { Router } = require('express');

const { Post, Comment } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = Router();

router.post('/', isLoggedIn, async (req, res, next) => {
  // POST /post
  try {
    // 프론트에서 생성한 게시글이 post 에 객체로 담긴다.
    const post = await Post.create({
      content: req.body.content, // 이름을 잘 맞춰 줘야 한다.
      UserId: req.user.id, // deserialize를 통해 req.user가 생성
    });
    res.status(201).json(post); // 잘 생성 되고 프론트에 돌려 줌
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
      PostId: req.params.postId, // 주소에 들어가는 파라미터 (좀 더 자세하게 적기 위해 req.body 말고 req.params로 적는다.)
      UserId: req.user.id,
    });
    res.status(201).json(comment); // 잘 생성 되고 프론트에 돌려 줌
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/', (req, res) => {
  // DELETE /post
  res.json({ id: 1 });
});

module.exports = router;
