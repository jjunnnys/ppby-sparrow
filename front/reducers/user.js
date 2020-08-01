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

/* 더미 유저 데이터 함수 만들기 */

// useInfo에 해당
const dummyUser = (data) => ({
  // data -> email, password
  ...data,
  nickname: '민준',
  id: 1,
  /* 시퀄라이즈에서 합쳐준다. 대문자로 */
  Posts: [{ id: 1 }], // 내 가쓴 글
  Followings: [{ nickname: 'pepperBoy' }], // 내가 팔로우한 사람
  Followers: [{ nickname: '칠리걸' }], // 나를 팔로우한 사람
});

const reducer = (state = initialSate, action) => {
  // 직접 바꾸면 참조관계가 유지돼서 history가 안 남는다.
  switch (action.type) {
    // 로그인
    case LOG_IN_REQUEST:
      console.log('reducer login');
      return {
        ...state,
        logInLoading: true,
        logInDone: false,
        logInError: null,
      };
    case LOG_IN_SUCCESS:
      return {
        ...state,
        logInLoading: false,
        logInDone: true,
        userInfo: dummyUser(action.data),
      };
    case LOG_IN_FAILURE:
      return {
        ...state,
        logInLoading: false,
        logInError: action.error,
      };
    // 로그아웃
    case LOG_OUT_REQUEST:
      return {
        ...state,
        logOutLoading: true,
        logOutDone: false,
        logOutError: null,
      };
    case LOG_OUT_SUCCESS:
      return {
        ...state,
        logOutLoading: false,
        logOutDone: true,
        userInfo: null,
      };
    case LOG_OUT_FAILURE:
      return {
        ...state,
        logOutLoading: false,
        logOutError: action.error,
      };
    // 회원가입
    case SIGN_UP_REQUEST:
      return {
        ...state,
        signUpLoading: true,
        signUpDone: false,
        signUpError: null,
      };
    case SIGN_UP_SUCCESS:
      return {
        ...state,
        signUpLoading: false,
        signUpDone: true,
      };
    case SIGN_UP_FAILURE:
      return {
        ...state,
        signUpLoading: false,
        signUpError: action.error,
      };
    // 닉네임 바꾸기
    case CHANGE_NICKNAME_REQUEST:
      return {
        ...state,
        changeNicknameLoading: true,
        changeNicknameDone: false,
        changeNicknameError: null,
      };
    case CHANGE_NICKNAME_SUCCESS:
      return {
        ...state,
        changeNicknameLoading: false,
        changeNicknameDone: true,
      };
    case CHANGE_NICKNAME_FAILURE:
      return {
        ...state,
        changeNicknameLoading: false,
        changeNicknameError: action.error,
      };
    case ADD_POST_TO_USER_INFO:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          Posts: [{ id: action.data }, ...state.userInfo.Posts],
        },
      };
    case REMOVE_POST_OF_USER_INFO:
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          Posts: state.userInfo.Posts.filter(
            (value) => value.id !== action.data
          ),
        },
      };
    default:
      return state;
  }
};

export default reducer;
