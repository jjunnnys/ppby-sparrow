export const initialSate = {
  mainPosts: [
    {
      // 백엔드 개발자한테 어떤 식으로 데이터를 줄것이냐라고 물어보기
      // sequelize 속성에서 다른 데이터의 속성과 합처서 주는 건 대문자로 적음
      id: 1,
      User: {
        id: 1,
        nickname: 'ppby',
      },
      content: '첫 번째 게시글 #해시태그 #익스프레스',
      Images: [
        {
          src:
            'https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F242DFD4752C93C7B20',
        },
        {
          src:
            'https://img1.daumcdn.net/thumb/R720x0.q80/?scode=mtistory2&fname=http%3A%2F%2Fcfile24.uf.tistory.com%2Fimage%2F99A72E3D5A7F0F071F66CE',
        },
        {
          src:
            'https://i.pinimg.com/originals/5a/ca/83/5aca83493f17caf160053e9b16d59890.jpg',
        },
      ],
      Comments: [
        {
          user: {
            nickname: 'ppby2',
          },
          content: '멋있다...',
        },
        {
          user: {
            nickname: 'ppby1',
          },
          content: '짱이다...',
        },
      ],
    },
  ],
  imagePaths: [],
  postAdded: false,
};

// 액션이름을 상수로 뺌
const ADD_POST = 'ADD_POST';
export const addPost = {
  type: ADD_POST,
};

const dummyPost = {
  id: 2,
  content: '더미데이터입니다.',
  User: {
    id: 1,
    nickname: 'ppby',
  },
  Images: [],
  Comments: [],
};

const reducer = (state = initialSate, action) => {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        // 추가되는 값을 앞에 넣는다.
        mainPosts: [dummyPost, ...state.mainPosts],
        postAdded: true,
      };
    default:
      return state;
  }
};

export default reducer;
