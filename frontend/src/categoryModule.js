import axios from "axios";
//import fs from 'fs';
//const fs = require('fs');
//import path from 'path';
//import {createStore} from 'vuex';


//const CATEGORY_FILE_PATH = './data/category.json';

const categoryModule = {
  state() {
    return {
      //products: product, //사실 안쓸듯?
      categorys: [],
    };
  },

  mutations: {
    //카테고리 on/off
    toggleCategory(state, categoryId) {
      const category = state.categorys.find((cat) => cat.id === categoryId);
      if (category) {
        let switchOn = category.isOn;
        category.isOn = switchOn;
        //바꾸지 않은 이유는, v-switch에 모델을 설정해주면, 이벤트 함수 설정 없이도 switch를 누르면 값이 바뀐다.
      }
      //만약 이부분을 DB에 추가한다면 변경해야 함
    },
    //DB에서 카테고리 업데이트
    setCategorys(state, categorys) {
      state.categorys = categorys; // 카테고리 데이터 업데이트
      console.log("가져온 카테고리:",categorys);
    },

    //카테고리에 변경사항 적용시, commit/rollback 후 다시 가져오기
    changeCategorys(state, newCategorys) {
      state.categorys = newCategorys;
      //굳이 newCategories인 이유는 없음
    },


    //카테고리 생성
    addCategory(state, newCategory) {
      if (newCategory.name.trim() !== "") {
        //+1하는 걸 vue에서 하도록 바꿈, 10단위로 올라가는 문제가 자꾸 생김
        state.categorys.push(newCategory);
      }
    },

    //카테고리 변경
    updateCategory(state, { id, name, alias }) {
      console.log("변경 시작:",name);
      const categoryToUpdate = state.categorys.find(
        (category) => category.id == id
      );

      console.log("찾은 카테고리:",categoryToUpdate)
      if (categoryToUpdate) {
        categoryToUpdate.name = name;
        categoryToUpdate.alias = alias;
    
        console.log("수정 후 카테고리:",categoryToUpdate)
      } else {
        console.error('해당 ID의 카테고리를 찾을 수 없습니다.');
      }
    },

    //카테고리 삭제
    deleteCategory(state, id) {
      const indexToDelete = state.categorys.findIndex(
        (category) => category.id === id
      );
      if (indexToDelete !== -1) {
        // 선택한 id의 카테고리 삭제
        state.categorys.splice(indexToDelete, 1);

        // 삭제한 카테고리 id보다 큰 카테고리들의 id를 1씩 앞으로 땡김
        /*state.Categorys.forEach(category => {
                if (category.id > id) {
                  category.id--;
                }
              });*/
      }
    },

    //밑에 더 추가 바람
  },

  actions: {
    async fetchCategorys({ commit }) {
      //DB를 사용하는 경우
      // try {
      //   // /categories/getAllCategories 엔드포인트에 GET 요청 보내기
      //   const response = await axios.get("/api/category/getAllCategories");
      //   console.log("API Response:", response.data); // Add this line to log the API response
      //   let CategoryData = [];
      //   // 응답에서 카테고리 데이터 추출
      //   const responseData = response.data;
      //   console.log("API Response:", response.data); // Add this line to log the API response
      //   responseData.forEach((item) => {
      //     // 원하는 형태로 변환하여 객체 생성
      //     const setcategory = {
      //       id: item.CategoryNO,
      //       name: item.CategoryName,
      //       alias: item.CategoryAlias,
      //       isOn: item.IsOn == 1 ? true : false,
      //       //mariaDB는 1/0 으로 바꾸기에 이렇게 지속적인 변경이 필요하다.
      //     };
      //     CategoryData.push(setcategory);
      //   });
      //   // 받아온 카테고리 데이터를 store에 저장하기 위해 mutation 호출
      //   commit("setCategorys", CategoryData);
      // } catch (error) {
      //   console.error("카테고리 데이터를 불러오는 중 오류 발생:", error);
      // }

      //제출용 testData 사용 시
      //require('./data/category.json');
      try {
        const response = await axios.get("/api/category/getAllCategories");
        //const categories = require('./data/category.json');
        const responseData = response.data;
        console.log("실제로 가져온 JSON:",responseData)
        commit('setCategorys', responseData);
      } catch (error) {
        console.error('Error reading categories from JSON file:', error);
      }

    },

    //카테고리 추가
    async addCategory({ commit }, newCategory) {
      //DB사용 시
      // try {
      //   // 서버에 카테고리 추가 요청 보내기
      //   await axios.post("/api/category/add", {
      //     categoryId: newCategory.id,
      //     categoryName: newCategory.name,
      //   });

      //   // DB에 추가하면 이제 여기 store(웹페이지)에서에 데이터 추가도 적용
      //   console.log(newCategory.name + "추가 성공");
      //   context.commit("addCategory", newCategory);
      // } catch (error) {
      //   console.error("카테고리 추가 중 오류 발생:", error);
      // }

      //제출용
      try {
        commit('addCategory', newCategory);
        //fs.writeFileSync(CATEGORY_FILE_PATH, JSON.stringify(state.categories, null, 2));
      } catch (error) {
        console.error('Error writing new category to JSON file:', error);
      }
    },

    async deleteCategory({ commit }, id) {
      // try {
      //   // 서버에 카테고리 삭제 요청 보내기
      //   await axios.post("/api/category/delete", { categoryId: id });

      //   // DB에 추가하면 이제 여기 store에도 적용
      //   context.commit("deleteCategory", id);
      // } catch (error) {
      //   console.error("카테고리 삭제 중 오류 발생:", error);
      // }
      //context.commit('deleteCategory', id);
      try {
        //console.log("삭제하려는 id",id);
        commit('deleteCategory', id);
        //fs.writeFileSync(CATEGORY_FILE_PATH, JSON.stringify(state.categories, null, 2));
      } catch (error) {
        console.error('Error deleting category from JSON file:', error);
      }
    },

    // 카테고리 정보 변경
    async updateCategory({ commit }, {id, name, alias} ) {
      // try {
      //   // 서버에 카테고리 변경 요청 보내기
      //   //console(name+'is here!');
      //   await axios.post("/api/category/update", {
      //     categoryId: id,
      //     categoryName: name /*, newAlias */,
      //   });

      //   // 변경 성공 시 스토어 상태 업데이트
      //   context.commit("updateCategory", { id, name, alias });
      // } catch (error) {
      //   console.error("카테고리 변경 중 오류 발생:", error);
      // }
      
      try {
        console.log('업데이트 카테고리 시작');
        console.log('selectedCategoryId:', id);
        console.log('editedCategoryName:', name);
        commit('updateCategory', { id, name, alias });
        //fs.writeFileSync(CATEGORY_FILE_PATH, JSON.stringify(state.categories, null, 2));
      } catch (error) {
        console.error('Error updating category in JSON file:', error);
      }
    },

    // 카테고리 적용,
    async applyCategory({ commit }, newCategory) {
    
      try {
        // 서버에 카테고리 업데이트 요청 보내기
        //console.log("변경사항 확인(카테고리):", state.categorys)
        await axios.post("/api/category/apply", newCategory);
        commit('changeCategorys', newCategory);
      } catch (error) {
        console.error("카테고리 업데이트 중 오류 발생:", error);
      }
     
    },

    //카테고리 적용 취소, 다 rollback하고 다시 DB에서 가져온다.
    async cancelCategory(context) {
      // try {
      //   // 서버에 카테고리 취소 요청 보내기
      //   await axios.post("/api/category/cancel");
      //   // 취소 성공 시 다시 DB에서 가져와서 초기화하기
      //   context.dispatch("fetchCategorys");
      // } catch (error) {
      //   console.error("카테고리 취소 중 오류 발생:", error);
      // }

      try {
        context.dispatch("fetchCategorys");
      } catch (error) {
        console.error('Error canceling category changes:', error);
      }
    },

    async toggleCategory({ commit }, { id }) {
      // try {
      //   // 서버에 카테고리 취소 요청 보내기
      //   console.log(isOn);
      //   await axios.post("/api/category/toggle", {
      //     categoryId: id,
      //     categoryOn: isOn,
      //   });
      //   // 취소 성공 시 다시 DB에서 가져와서 초기화하기
      //   context.commit("toggleCategory", id);
      // } catch (error) {
      //   console.error("카테고리 취소 중 오류 발생:", error);
      // }

      try {
        commit('toggleCategory', id);
        //fs.writeFileSync(CATEGORY_FILE_PATH, JSON.stringify(state.categories, null, 2));
      } catch (error) {
        console.error('Error toggling category in JSON file:', error);
      }
    },
  },

  getters: {
    // 모든 카테고리 반환
    allCategories: (state) => state.categorys,

    // 특정 id를 가진 카테고리 반환
    getCategoryById: (state) => (id) => {
      return state.categorys.find((category) => category.id === id);
    },

    // 특정 이름을 가진 카테고리 반환
    getCategoryByName: (state) => (name) => {
      return state.categorys.find((category) => category.name === name);
    },

    // 별칭으로 반환
    getCategoryByAlias: (state) => (alias) => {
      return state.categorys.filter((category) => category.alias == alias);
    },

    // 활성화된 카테고리 반환
    activeCategories: (state) => {
      return state.categorys.filter((category) => category.isOn);
    },
  },
};

export default categoryModule;
