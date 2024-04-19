import { createStore } from 'vuex';
import categoryModule from './categoryModule';
import tagModule from './tagModule';

const store = createStore({
  state() {
    return {
        //categroies인데 큰일남

      // 여기에 다른 전역 상태도 추가할 수 있습니다.
    };
  },
  modules: {
    categoryModule: categoryModule, // categoryModule을 Vuex 스토어에 등록
    tagModule: tagModule,
    // 다른 모듈도 필요하다면 여기에 추가합니다.
  }
});

export default store;
