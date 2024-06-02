// store.js
import axios from 'axios';

const HOST = "http://localhost:3000";

//키오스크 매장모드 시작 시 모든 옵션을 가져오는 역할, 그냥 fetch기능을 다 가져옴
const kioskModule = {
  state() {
    return {
      categories: [],
      tags: [],
      options: [],
      products: [],
      tagMenu: [],
      //shopMenu: [],
      //user: [],

    };
  },
  mutations: {
    setOptions(state, options) {
      state.options = options;
    },
    setTags(state, Tags) {
      state.tags = Tags; 
    },
    setCategories(state, categories) {
      state.categories = categories; // 카테고리 데이터 업데이트 
    },
    setProducts(state, products){
      state.products = products;
    },
    setTagMenu(state, tagMenu){
      state.tagMenu = tagMenu;
    },
    addProduct(state, newProduct){
      if (newProduct.name.trim() !== "") {
        //+1하는 걸 vue에서 하도록 바꿈, 10단위로 올라가는 문제가 자꾸 생김
        console.log("추가하려는 메뉴는 바로 이것이다:",newProduct);
        const setProduct = {
          "id": newProduct.id,
          "name": newProduct.name,
          "price": newProduct.price,
          "category": newProduct.category,
          "detail": newProduct.detail,
          "image": newProduct.image,
          "alias": newProduct.alias,
          //isOn: newProduct.IsOn == 1 ? true : false
          "isOn": true,
          //mariaDB는 1/0 으로 바꾸기에 이렇게 지속적인 변경이 필요하다.
      };
        state.products.push(setProduct);
      }
    },
    deleteProduct(state, id){
      console.log("id현황",id)
      const indexToDelete = state.products.findIndex(
        (product) => product.id === id
      );
      if (indexToDelete !== -1) {
        // 선택한 id의 카테고리 삭제
        state.products.splice(indexToDelete, 1);
      }
      console.log("삭제 후 근황:",state.products);
    },
    changeProduct(state, { newProduct }) {
      const productToUpdate = state.products.find(
        (product) => product.id == newProduct.id
      );
      if (productToUpdate) {
        productToUpdate.name = newProduct.name;
        productToUpdate.price = newProduct.price;
        productToUpdate.category = newProduct.category;
        productToUpdate.detail = newProduct.detail;
        productToUpdate.alias = newProduct.alias;
        productToUpdate.isOn = true;
        
        //   isOn: true,
      }
      //vue에서 사용법 (함수 내에서 )= this.$store.commit('updateCategory', { id: 1, newName: '새로운 이름', newAlias: '새로운 별칭' });
    },

  },
  actions: {
    //DB용 코드를 주석처리하고 제출용 testData를 불러오는 코드로 변경함

    // 모든 태그의 옵션 가져오기
    async fetchOptions({ commit }) {
      try {
        const response = await axios.get(HOST + '/kiosk/getOption');
        // let optionData =[];
        const responseData = response.data;

        // responseData.forEach(item =>{
        //   const setOption = {
        //       id: item.DetNO,
        //       name: item.DetName,
        //       price: item.AddPrice,
        //       tag: item.TagNO,
        //       image: item.DetImage,
        //       alias: item.DetAlias,
        //       orderNo: item.orderNo,
        //       duplicate: item.isDup, //중복여부, true면 중복 허용 = 체크박스로 구현
        //   };
        //   optionData.push(setOption);
        // });
        //commit('setOptions', optionData);

        commit('setOptions', responseData);
      } catch (error) {
        console.error('옵션 목록을 가져오는 중 에러:', error);
      }
    },
    

    //모든 태그 가져오기
    async fetchTags({ commit }) {
      // try {
       
      //   const response = await axios.get(HOST + '/kiosk/getTag');

      //   let TagData = [];
      //   // 응답에서 카테고리 데이터 추출
      //   const responseData = response.data;

      //   responseData.forEach(item => {
      //     // 원하는 형태로 변환하여 객체 생성
      //     const setTag = {
      //         id: item.TagNO,
      //         name: item.TagName,
      //         alias: item.TagAlias,
      //         description: item.TagDet,
      //         isRequired: item.IsRequired == 1 ? true : false,
      //         isOn: item.IsOn == 1 ? true : false
      //         //mariaDB는 1/0 으로 저장하기에 이렇게 지속적인 변경이 필요하다.
      //     };
      //     TagData.push(setTag);
      // });
      //   // 받아온 카테고리 데이터를 저장하기 위해 mutation 호출
      //   commit('setTags', TagData);
      // } catch (error) {
      //   console.error('카테고리 데이터를 불러오는 중 오류 발생:', error);
      // }
      try {
        const response = await axios.get(HOST + '/kiosk/getTag');
        const responseData = response.data;
        commit('setTags', responseData);
      } catch (error) {
        console.error(' 데이터를 불러오는 중 오류 발생:', error);
      }
    },

    //모든 카테고리 가져오기
    async fetchCategories({ commit }) {
      // try {
      //   // /categories/getAllCategories 엔드포인트에 GET 요청 보내기
      //     const response = await axios.get(HOST + '/kiosk/getCategory');
      //      console.log("API Response:", response.data);  // Add this line to log the API response
      //   let CategoryData = [];
      //   // 응답에서 카테고리 데이터 추출
      //   const responseData = response.data;
      //      console.log("API Response:", response.data);  // Add this line to log the API response
      //   responseData.forEach(item => {
      //     // 원하는 형태로 변환하여 객체 생성
      //     const setcategory = {
      //         id: item.CategoryNO,
      //         name: item.CategoryName,
      //         alias: item.CategoryAlias,
      //         isOn: item.IsOn == 1 ? true : false
      //         //mariaDB는 1/0 으로 바꾸기에 이렇게 지속적인 변경이 필요하다.
      //     };
      //     CategoryData.push(setcategory);
      // });
      //   // 받아온 카테고리 데이터를 store에 저장하기 위해 mutation 호출
      //   commit('setCategories', CategoryData);
      // } catch (error) {
      //   console.error('카테고리 데이터를 불러오는 중 오류 발생:', error);
      // }
      try {
        const response = await axios.get(HOST + '/kiosk/getCategory');
        const responseData = response.data;
        commit('setCategories', responseData);
      } catch (error) {
        console.error(' 데이터를 불러오는 중 오류 발생:', error);
      }
  },

    //상품 가져오기
    async fetchProducts({ commit }) {
      // try {
      //   // /categories/getAllCategories 엔드포인트에 GET 요청 보내기
      //     const response = await axios.get(HOST + '/kiosk/getProduct');
      //     console.log("API Response:", response.data);  // Add this line to log the API response
      //   let productData = [];
      //   // 응답에서 카테고리 데이터 추출
      //   const responseData = response.data;
      //     console.log("API Response:", response.data);  // Add this line to log the API response
      //   responseData.forEach(item => {
      //     // 원하는 형태로 변환하여 객체 생성
      //     const setProduct = {
      //         id: item.ProductNO,
      //         name: item.ProductName,
      //         price: item.Price,
      //         category: item.CategoryNO,
      //         detail: item.ProductDetail,
      //         image: item.ProductImage,
      //         alias: item.CategoryAlias,
      //         isOn: item.IsOn == 1 ? true : false
      //         //mariaDB는 1/0 으로 바꾸기에 이렇게 지속적인 변경이 필요하다.
      //     };
      //     productData.push(setProduct);
      // });
      //   // 받아온 카테고리 데이터를 store에 저장하기 위해 mutation 호출
      //   commit('setProducts', productData);
      // } catch (error) {
      //   console.error('카테고리 데이터를 불러오는 중 오류 발생:', error);
      // }
      try {
        const response = await axios.get(HOST + '/kiosk/getProduct');
        const responseData = response.data;
        commit('setProducts', responseData);
      } catch (error) {
        console.error(' 데이터를 불러오는 중 오류 발생:', error);
      }
    },

//상품별 태그 가져오기
async fetchTagMenu({ commit }) {
  // try {
  //   // /categories/getAllCategories 엔드포인트에 GET 요청 보내기
  //     const response = await axios.get(HOST + '/kiosk/getTagMenu');
  //      console.log("API Response:", response.data);  // Add this line to log the API response
  //   let tagMenuData = [];
  //   // 응답에서 카테고리 데이터 추출
  //   const responseData = response.data;
  //      console.log("API Response:", response.data);  // Add this line to log the API response
  //   responseData.forEach(item => {
  //     // 원하는 형태로 변환하여 객체 생성

  //     const setTagMenu = {
  //        productId: item.ProductNO,
  //        tagId: item.TagNo,
  //        orderNo: item.orderNo,
  //         //mariaDB는 1/0 으로 바꾸기에 이렇게 지속적인 변경이 필요하다.
  //     };

  //     tagMenuData.push(setTagMenu);
  // });
  //   // 받아온 카테고리 데이터를 store에 저장하기 위해 mutation 호출
  //   commit('setTagMenu', tagMenuData);
  // } catch (error) {
  //   console.error('카테고리 데이터를 불러오는 중 오류 발생:', error);
  // }
  try {
    const response = await axios.get(HOST + '/kiosk/getTagMenu');
    const responseData = response.data;
    commit('setTagMenu', responseData);
  } catch (error) {
    console.error(' 데이터를 불러오는 중 오류 발생:', error);
  }
},

async addProduct({commit, state}, newProduct) {
    // try {
    //   console.log("받은 데이터 형식 테스트", newProduct);
    //   // 서버에추가 요청 보내기
    //   await axios.post('/api/product/addProduct', {
    //     product: newProduct
    //   });

    //   // DB에 추가하면 이제 여기 store(웹페이지)에서에 데이터 추가도 적용
    //   console.log(newProduct.name + "추가 성공");
    //   context.commit("addProduct", newProduct);
    // } catch (error) {
    //   console.error("추가 중 오류 발생:", error);
    // }
    // //context.commit('addCategory', newCategory);
    try {
      commit("addProduct", newProduct);
      // await axios.post('/api/product/changeProduct', {product: state.products});
      await axios.post('/api/product/changeProduct', state.products);
    } catch (error) {
        console.error("변경 중 오류 발생:", error);
    }
  },

async deleteProduct({commit, state}, deleteId) {
    // try {
    //   // 서버에추가 요청 보내기
    //   await axios.post('/api/product/deleteProduct', {
    //     productId: deleteId
    //   });

    //   // DB에 추가하면 이제 여기 store(웹페이지)에서에 데이터 추가도 적용
    //   context.commit("deleteProduct", deleteId);
    // } catch (error) {
    //   console.error("오류 발생:", error);
    // }
    try {
      commit("deleteProduct", deleteId);
      // await axios.post('/api/product/changeProduct', {product: state.products});
      await axios.post('/api/product/changeProduct', state.products);
    } catch (error) {
        console.error("변경 중 오류 발생:", error);
    }
  },

async changeProduct({commit, state}, newProduct ) {
    // try {
    //     console.log("받은 데이터 형식 테스트", newProduct);
    //     // 서버에 변경 요청 보내기
    //     await axios.post('/api/product/changeProduct', {
    //         product: newProduct,
    //     });

    //     // DB에 변경 사항이 적용되면 상태를 업데이트합니다.
    //     console.log(newProduct.name + " 변경 성공");
    //     // 변경된 상품 정보를 store(웹페이지)에도 반영합니다.
    //     context.commit("changeProduct", { newProduct });
    // } catch (error) {
    //     console.error("변경 중 오류 발생:", error);
    // }
  try {
      console.log("받은 데이터 형식 테스트", newProduct);
      commit("changeProduct", { newProduct });
      console.log(newProduct.name + " 변경 성공");
      // await axios.post('/api/product/changeProduct', {product: state.products});
      await axios.post('/api/product/changeProduct', state.products);
  } catch (error) {
      console.error("변경 중 오류 발생:", error);
  }
},


},
  getters: {
    // 모든 옵션 반환
    allOptions: state => state.options,
  },
};

export default kioskModule;
