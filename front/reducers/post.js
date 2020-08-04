import shortId from 'shortid';
import prodece from 'immer';
import faker from 'faker';

export const initialSate = {
  mainPosts: [],
  imagePaths: [],
  hasMorePosts: true, // 처음 게시물이 0개일 때는 포스트를 가져오는 시도를 해야함
  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,
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

/* 
  서버에서 데이터 불러오는 테스 코드
  - 무한 스크롤링 -> 스크롤을 다 하면 10개 불러오고 다 하면 10개 불러오고 
  - saga에서 10개씩 불러오게 설정한다.
*/

// saga 에서 쓰기 위해 export
export const generateDummyPost = (number) =>
  Array(number)
    .fill()
    .map(() => ({
      id: shortId.generate(),
      User: {
        id: shortId.generate(),
        nickname: faker.name.findName(),
      },
      content: faker.lorem.paragraph(),
      Images: [
        {
          id: shortId.generate(),
          src: faker.image.image(),
        },
      ],
      Comments: [
        {
          id: shortId.generate(),
          user: {
            id: shortId.generate(),
            nickname: faker.name.findName(),
          },
          content: faker.lorem.sentences(),
        },
      ],
    }));

/* 액션 */

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';

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

/* 리듀서란? 이전 상태를 액션을 통해 다음 상태로 만들어내는 함수(불변성 유지) */

const reducer = (state = initialSate, action) => {
  // state는 건들면 안 됨, 기존에 state를 draft로 대체
  return prodece(state, (draft) => {
    switch (action.type) {
      /* 로딩 포스트 추가 */
      case LOAD_POSTS_REQUEST:
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
        break;
      case LOAD_POSTS_SUCCESS:
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        // 10개 씩 포스터 불러오기, action.data의 기존 데이터에 draft.mainPosts 데이터 넣기
        draft.mainPosts = action.data.concat(draft.mainPosts);
        // 포스트 불러오기 제한 하기
        draft.hasMorePosts = draft.mainPosts.length < 50; // 일단 50개 까지 임의로 설정, 50이 되면 false가 되서 포스트를 더 이상 안가져 온다.
        break;
      case LOAD_POSTS_FAILURE:
        draft.loadPostsLoading = false;
        draft.loadPostsError = action.error;
        break;
      /* 포스트 추가 */
      case ADD_POST_REQUEST:
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
        break;
      case ADD_POST_SUCCESS:
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.mainPosts.unshift(action.data);
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
          (value) => value.id === action.data.PostId // post router에서 대문자로 PostId를 작성했기 때문에 똑같이 대문자로 작성
        );
        // 2. 그 게시글에 댓글 추가
        post.Comments.unshift(action.data);

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
