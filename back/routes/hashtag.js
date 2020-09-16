const express = require('express');
const { Op } = require('sequelize');

const { Post, Hashtag, User, Image, Comment } = require('../models');

const router = express.Router();

/* 검색된 해시태그 가져오기 */
// GET /hashtag/노드
router.get('/:tag', async (req, res, next) => {
  try {
    const where = {};

    // 초기 로딩이 아닐 때
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; // id가 lastId 보다 작은 -> [Op.lt]
    } // 10개 를 불러왔을 때 그 lastId 보다 작은 게사물을 불러 와야 함
    // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1

    // 여러 개 가져오기
    const posts = await Post.findAll({
      where, // where 만 바꿔서 user의 게시글 검색일 될 수도, hashtag의 검색이 될 수도 있다.
      limit: 10,
      // 정보를 가져올 땐 항상 환성시켜서 가져온다.
      include: [
        {
          model: Hashtag,
          // include 내부에서도 조건(where)을 걸 수 있음
          // get 요청 시 한글 들어가면 에러 뜸 -> decodeURIComponent 로 감싸 줌
          where: { name: decodeURIComponent(req.params.tag) },
        },
        {
          model: User,
          attributes: ['id', 'nickname'], // User 정볼르 가져올 떄 id, nickname만 가져온다.
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'], // User 정볼르 가져올 떄 id, nickname만 가져온다.
            },
          ],
        },
        {
          model: User,
          through: 'Like',
          as: 'Likers',
          attributes: ['id'],
        },
        {
          model: Post,
          as: 'Retweet',
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
