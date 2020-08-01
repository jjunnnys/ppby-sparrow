import shortId from 'shortid';

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
          id: 1,
          user: {
            nickname: 'ppby2',
          },
          content: '멋있다...',
        },
        {
          id: 2,
          user: {
            nickname: 'ppby1',
          },
          content: '짱이다...',
        },
      ],
    },
  ],
  imagePaths: [],
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
};

/* 액션 */

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

/* 동적 액션 생성함수 */

export const addPost = (data) => ({
  type: ADD_POST_REQUEST,
  data,
});

export const addComment = (data) => ({
  type: ADD_COMMENT_REQUEST,
  data,
});

const dummyPost = (data) => ({
  id: shortId.generate(), // id를 정하기 애매할 떄 사용
  content: data,
  User: {
    id: 1,
    nickname: 'ppby',
  },
  Images: [],
  Comments: [],
});

const dummyComment = (data) => ({
  id: shortId.generate(), // id를 정하기 애매할 떄 사용
  content: data,
  user: {
    id: 1,
    nickname: 'ppby',
  },
});

const reducer = (state = initialSate, action) => {
  switch (action.type) {
    // 포스트
    case ADD_POST_REQUEST:
      return {
        ...state,
        addPostLoading: true,
        addPostDone: false,
        addPostError: null,
      };
    case ADD_POST_SUCCESS:
      return {
        ...state,
        mainPosts: [dummyPost(action.data), ...state.mainPosts],
        addPostLoading: false,
        addPostDone: true,
      };
    case ADD_POST_FAILURE:
      return {
        ...state,
        addPostLoading: false,
        addPostError: action.error,
      };
    // 댓글
    case ADD_COMMENT_REQUEST:
      return {
        ...state,
        addCommentLoading: true,
        addCommentDone: false,
        addCommentError: null,
      };
    case ADD_COMMENT_SUCCESS: {
      // 게시글 id를 통해서 찾고 그 안에 Comments로 접근한다.
      const postIndex = state.mainPosts.findIndex(
        (value) => value.id === action.data.postId
      );
      const post = state.mainPosts[postIndex];
      post.Comments = [dummyComment(action.data.content), ...post.Comments];
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = post;
      return {
        ...state,
        mainPosts,
        addCommentDone: true,
        addCommentLoading: false,
      };
    }
    case ADD_COMMENT_FAILURE:
      return {
        ...state,
        addCommentLoading: false,
        addCommentError: action.error,
      };
    default:
      return state;
  }
};

export default reducer;
