import { HYDRATE } from 'next-redux-wrapper'; // ssr을 위한 작업
import { combineReducers } from 'redux';
import user from './user';
import post from './post';

// rootReducer 상태를 전체 덮어 씌우기
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log('HYDRATE', action);
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
        post,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;
