export const initialSate = {
  isLoggedIn: false,
  userInfo: null,
  signUpdate: {},
  loginData: {},
};

// 액션 생성함수
export const loginAction = (data) => {
  return {
    type: 'LOG_IN',
    data,
  };
};
export const logoutAction = () => {
  return {
    type: 'LOG_OUT',
  };
};

const reducer = (state = initialSate, action) => {
  // 직접 바꾸면 참조관계가 유지돼서 history가 안 남는다.
  switch (action.type) {
    case 'LOG_IN':
      return {
        ...state,

        isLoggedIn: true,
        userInfo: action.data,
      };
    case 'LOG_OUT':
      return {
        ...state.name,
        isLoggedIn: false,
        userInfo: null,
      };
    default:
      return state;
  }
};

export default reducer;
