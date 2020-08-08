import produce from 'immer';

export const initialSate = {
  userInfo: null,
  signUpdate: {},
  loginData: {},
  logInLoading: false, // 로그인 시도 중
  logInDone: false,
  logInError: null,
  logOutLoading: false, // 로그아웃 시도 중
  logOutDone: false,
  logOutError: null,
  signUpLoading: false, // 회원가입 시도 중
  signUpDone: false,
  signUpError: null,
  changeNicknameLoading: false, // 닉네임 변경 시도 중
  changeNicknameDone: false,
  changeNicknameError: null,
  followLoading: false, // 팔로우 시도 중
  followDone: false,
  followError: null,
  unfollowLoading: false, // 언팔로우 시도 중
  unfollowDone: false,
  unfollowError: null,
};

/* 액션 */

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

export const CHANGE_NICKNAME_REQUEST = 'UNFOLLOW_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'UNFOLLOW_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'UNFOLLOW_FAILURE';

// 리듀셔는 액션을 통해서 상태를 바꿀 수 있기 떄문에 post 관련 액션을 만든다.
export const ADD_POST_TO_USER_INFO = 'ADD_POST_TO_USER_INFO';
export const REMOVE_POST_OF_USER_INFO = 'REMOVE_POST_OF_USER_INFO';

/* 액션 생성함수 (saga가 성공과 실패 했을 때 액션을 호출해 주기 때문에 (SUCCESS,FAILURE) 굳이 안 만들어도 된다.) */

export const loginRequestAction = (data) => {
  return {
    type: LOG_IN_REQUEST,
    data,
  };
};

export const logoutRequestAction = () => {
  return {
    type: LOG_OUT_REQUEST,
  };
};

const reducer = (state = initialSate, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      /* 팔로우 */
      case FOLLOW_REQUEST:
        draft.followLoading = true;
        draft.followDone = false;
        draft.followError = null;
        break;
      case FOLLOW_SUCCESS:
        draft.userInfo.Followings.push({ id: action.data });
        draft.followLoading = false;
        draft.followDone = true;
        break;
      case FOLLOW_FAILURE:
        draft.followLoading = false;
        draft.followError = action.error;
        break;
      /* 언팔로우 */
      case UNFOLLOW_REQUEST:
        draft.unfollowLoading = true;
        draft.unfollowDone = false;
        draft.unfollowError = null;
        break;
      case UNFOLLOW_SUCCESS:
        draft.userInfo.Followings = draft.userInfo.Followings.filter(
          (value) => value.id !== action.data
        );
        draft.unfollowLoading = false;
        draft.unfollowDone = true;
        break;
      case UNFOLLOW_FAILURE:
        draft.unfollowLoading = false;
        draft.unfollowError = action.error;
        break;
      /* 로그인 */
      case LOG_IN_REQUEST:
        draft.logInLoading = true;
        draft.logInDone = false;
        draft.logInError = null;
        break;
      case LOG_IN_SUCCESS:
        draft.userInfo = action.data;
        draft.logInLoading = false;
        draft.logInDone = true;
        break;
      case LOG_IN_FAILURE:
        draft.logInLoading = false;
        draft.logInError = action.error;
        break;
      /* 로그아웃 */
      case LOG_OUT_REQUEST:
        draft.logOutLoading = true;
        draft.logOutDone = false;
        draft.logOutError = null;
        break;
      case LOG_OUT_SUCCESS:
        draft.userInfo = null;
        draft.logOutLoading = false;
        draft.logOutDone = true;
        break;
      case LOG_OUT_FAILURE:
        draft.logOutLoading = false;
        draft.logOutError = action.error;
        break;
      /* 회원가입 */
      case SIGN_UP_REQUEST:
        draft.signUpLoading = true;
        draft.signUpDone = false;
        draft.signUpError = null;
        break;
      case SIGN_UP_SUCCESS:
        draft.signUpLoading = false;
        draft.signUpDone = true;
        break;
      case SIGN_UP_FAILURE:
        draft.signUpLoading = false;
        draft.signUpError = action.error;
        break;
      /* 닉네임 바꾸기 */
      case CHANGE_NICKNAME_REQUEST:
        draft.changeNicknameLoading = true;
        draft.changeNicknameDone = false;
        draft.changeNicknameError = null;
        break;
      case CHANGE_NICKNAME_SUCCESS:
        draft.changeNicknameLoading = false;
        draft.changeNicknameDone = true;
        break;
      case CHANGE_NICKNAME_FAILURE:
        draft.changeNicknameLoading = false;
        draft.changeNicknameError = action.error;
        break;
      /* 게시글 작성 수 추가 */
      case ADD_POST_TO_USER_INFO:
        draft.userInfo.Posts.unshift({ id: action.data });
        break;
      /* 게시글 작성 수 삭제 */
      case REMOVE_POST_OF_USER_INFO:
        draft.userInfo.Posts = draft.userInfo.Posts.filter(
          (value) => value.id !== action.data
        );
        break;
      default:
        break;
    }
  });
};

export default reducer;
