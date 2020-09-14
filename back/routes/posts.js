/* 포스트 불러오는 과정에서 limit와 offset 방법 */
const { Router } = require('express');
const { Op } = require('sequelize');

const { Post, User, Image, Comment } = require('../models');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const where = {}; // 초기 로딩일 때랑 초기 로딩이 아닐 때 불러오는 조건이 다름

    // 초기 로딩이 아닐 때
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; // id가 lastId 보다 작은 -> [Op.lt]
    } // 10개 를 불러왔을 때 그 lastId 보다 작은 게사물을 불러 와야 함
    // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1

    // 여러 개 가져오기
    const posts = await Post.findAll({
      where,
      /* 중간에 게시글을 추가 삭제할 경우 치명적인 단점이 있다. 그래서 limit, lastId 방식을 사용한다. */
      limit: 10, // 10개만 가져와라
      // offset: 0, -> 1~10 가져와라 (내가 원하는 구간만 잘라서 가져올 수 있다.)
      // 2차원 배열 -> 여러 기준으로 정렬할 수 있기 떄문
      order: [
        ['createdAt', 'DESC'], // 게시글 내림차순
        [Comment, 'createdAt', 'DESC'], // 댓글 내림차순
      ],

      // 정보를 가져올 땐 항상 환성시켜서 가져온다.
      include: [
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
          model: User, // 좋아요 누른 사람
          as: 'Likers', // 다른 User와 구별이 된다.
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
