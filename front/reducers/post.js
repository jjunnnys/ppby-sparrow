import shortId from 'shortid';
import prodece from 'immer';

export const initialSate = {
  mainPosts: [
    {
      // 백엔드 개발자한테 어떤 식으로 데이터를 줄것이냐라고 물어보기
      // sequelize 속성에서 다른 데이터의 속성과 합처서 주는 건 대문자로 적음
      id: 1,
      User: {
        id: 1,
        nickname: '민준',
      },
      content: '첫 번째 게시글 #해시태그 #익스프레스',
      Images: [
        {
          id: shortId.generate(),
          src:
            'https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F242DFD4752C93C7B20',
        },
        {
          id: shortId.generate(),
          src:
            'https://img1.daumcdn.net/thumb/R720x0.q80/?scode=mtistory2&fname=http%3A%2F%2Fcfile24.uf.tistory.com%2Fimage%2F99A72E3D5A7F0F071F66CE',
        },
        {
          id: shortId.generate(),
          src:
            'https://i.pinimg.com/originals/5a/ca/83/5aca83493f17caf160053e9b16d59890.jpg',
        },
      ],
      // 대문자로 시작하는 건 서버에서 주는 데이터를 의미
      Comments: [
        {
          id: shortId.generate(),
          user: {
            id: shortId.generate(),
            nickname: 'ppby2',
          },
          content: '멋있다...',
        },
        {
          id: shortId.generate(),
          user: {
            id: shortId.generate(),
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
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
};

/* 액션 */

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

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

// 리듀서가 분리되어 있다. (user와 post)
const dummyPost = ({ id, content }) => ({
  id, // id를 정하기 애매할 떄 사용
  content,
  User: {
    id: 1,
    nickname: 'ppby',
  },
  Images: [
    {
      id: shortId.generate(),
      src:
        'https://cdn.pixabay.com/photo/2014/11/30/14/11/kitty-551554_960_720.jpg',
    },
  ],
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

/* 리듀서란? 이전 상태를 액션을 통해 다음 상태로 만들어내는 함수(불변성 유지) */

const reducer = (state = initialSate, action) => {
  // state는 건들면 안 됨, 기존에 state를 draft로 대체
  return prodece(state, (draft) => {
    switch (action.type) {
      /* 포스트 추가 */
      case ADD_POST_REQUEST:
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS:
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.mainPosts.unshift(dummyPost(action.data));
        break;
      case ADD_POST_FAILURE:
        draft.addPostLoading = false;
        draft.addPostError = action.error;
        break;
      /* 포스트 삭제 */
      case REMOVE_POST_REQUEST:
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
        break;
      case REMOVE_POST_SUCCESS:
        draft.removePostLoading = false;
        draft.removePostDone = true;
        // 지울때만 filter를 사용해서 편하게 함 (아니면 splice를 써야함)
        draft.mainPosts = draft.mainPosts.filter(
          (value) => value.id !== action.data
        );
        break;
      case REMOVE_POST_FAILURE:
        draft.removePostLoading = false;
        draft.removePostError = action.error;
        break;
      /* 댓글 */
      case ADD_COMMENT_REQUEST:
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
        break;
      case ADD_COMMENT_SUCCESS: {
        // 1. 게시글 id 찾기
        const post = draft.mainPosts.find(
          (value) => value.id === action.data.postId
        );
        // 2. 그 게시글에 댓글 추가
        post.Comments.unshift(dummyComment(action.data.content));

        draft.addCommentLoading = false;
        draft.addCommentDone = true;
        break;
      }
      case ADD_COMMENT_FAILURE:
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
        break;
      default:
        break;
    }
  });
};

export default reducer;
