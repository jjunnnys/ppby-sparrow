export const initialSate = {
  isLoggingIn: false, // 로그인 시도 중
  isLoggedIn: false,
  isLoggingOut: false, // 로그아웃 시도 중
  userInfo: null,
  signUpdate: {},
  loginData: {},
};

// 액션 생성함수 (saga가 성공과 실패 했을 때 액션을 호출해 주기 때문에 굳이 안만들어도 된다.)
export const loginRequestAction = (data) => {
  return {
    type: 'LOG_IN_REQUEST',
    data,
  };
};

export const logoutRequestAction = () => {
  return {
    type: 'LOG_OUT_REQUEST',
  };
};

const reducer = (state = initialSate, action) => {
  // 직접 바꾸면 참조관계가 유지돼서 history가 안 남는다.
  switch (action.type) {
    case 'LOG_IN_REQUEST':
      console.log('reducer login');
      return {
        ...state,
        isLoggingIn: true,
      };
    case 'LOG_IN_SUCCESS':
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: true,
        userInfo: { ...action.data, nickname: 'ppby' },
      };
    case 'LOG_IN_FAILURE':
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: false,
      };
    case 'LOG_OUT_REQUEST':
      return {
        ...state,
        isLoggingOut: true,
      };
    case 'LOG_OUT_SUCCESS':
      return {
        ...state,
        isLoggingOut: false,
        isLoggedIn: false,
        userInfo: null,
      };
    case 'LOG_OUT_FAILURE':
      return {
        ...state,
        isLoggingOut: false,
      };
    default:
      return state;
  }
};

export default reducer;
