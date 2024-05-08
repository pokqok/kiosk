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

  },
  actions: {
    // 모든 태그의 옵션 가져오기
    async fetchOptions({ commit }) {
      try {
        const response = await axios.get(HOST + '/kiosk/getOption');
        let optionData =[];
        const responseData = response.data;

        responseData.forEach(item =>{
          const setOption = {
              id: item.DetNO,
              name: item.DetName,
              price: item.AddPrice,
              tag: item.TagNO,
              image: item.DetImage,
              alias: item.DetAlias,
              orderNo: item.orderNo,
              duplicate: item.isDup, //중복여부, true면 중복 허용 = 체크박스로 구현
          };
          optionData.push(setOption);
        });
        commit('setOptions', optionData);
      } catch (error) {
        console.error('옵션 목록을 가져오는 중 에러:', error);
      }
    },
    

    //모든 태그 가져오기
    async fetchTags({ commit }) {
      try {
       
        const response = await axios.get(HOST + '/kiosk/getTag');

        let TagData = [];
        // 응답에서 카테고리 데이터 추출
        const responseData = response.data;

        responseData.forEach(item => {
          // 원하는 형태로 변환하여 객체 생성
          const setTag = {
              id: item.TagNO,
              name: item.TagName,
              alias: item.TagAlias,
              description: item.TagDet,
              isRequired: item.IsRequired == 1 ? true : false,
              isOn: item.IsOn == 1 ? true : false
              //mariaDB는 1/0 으로 저장하기에 이렇게 지속적인 변경이 필요하다.
          };
          TagData.push(setTag);
      });
        // 받아온 카테고리 데이터를 저장하기 위해 mutation 호출
        commit('setTags', TagData);
      } catch (error) {
        console.error('카테고리 데이터를 불러오는 중 오류 발생:', error);
      }
    },

    //모든 카테고리 가져오기
    async fetchCategories({ commit }) {
      try {
        // /categories/getAllCategories 엔드포인트에 GET 요청 보내기
          const response = await axios.get(HOST + '/kiosk/getCategory');
           console.log("API Response:", response.data);  // Add this line to log the API response
        let CategoryData = [];
        // 응답에서 카테고리 데이터 추출
        const responseData = response.data;
           console.log("API Response:", response.data);  // Add this line to log the API response
        responseData.forEach(item => {
          // 원하는 형태로 변환하여 객체 생성
          const setcategory = {
              id: item.CategoryNO,
              name: item.CategoryName,
              alias: item.CategoryAlias,
              isOn: item.IsOn == 1 ? true : false
              //mariaDB는 1/0 으로 바꾸기에 이렇게 지속적인 변경이 필요하다.
          };
          CategoryData.push(setcategory);
      });
        // 받아온 카테고리 데이터를 store에 저장하기 위해 mutation 호출
        commit('setCategories', CategoryData);
      } catch (error) {
        console.error('카테고리 데이터를 불러오는 중 오류 발생:', error);
      }
  },

  //상품 가져오기
  async fetchProducts({ commit }) {
    try {
      // /categories/getAllCategories 엔드포인트에 GET 요청 보내기
        const response = await axios.get(HOST + '/kiosk/getProduct');
         console.log("API Response:", response.data);  // Add this line to log the API response
      let productData = [];
      // 응답에서 카테고리 데이터 추출
      const responseData = response.data;
         console.log("API Response:", response.data);  // Add this line to log the API response
      responseData.forEach(item => {
        // 원하는 형태로 변환하여 객체 생성
        const setProduct = {
            id: item.ProductNO,
            name: item.ProductName,
            price: item.Price,
            category: item.CategoryNO,
            detail: item.ProductDetail,
            image: item.ProductImage,
            alias: item.CategoryAlias,
            isOn: item.IsOn == 1 ? true : false
            //mariaDB는 1/0 으로 바꾸기에 이렇게 지속적인 변경이 필요하다.
        };
        productData.push(setProduct);
    });
      // 받아온 카테고리 데이터를 store에 저장하기 위해 mutation 호출
      commit('setProducts', productData);
    } catch (error) {
      console.error('카테고리 데이터를 불러오는 중 오류 발생:', error);
    }
},

//상품별 태그 가져오기
async fetchTagMenu({ commit }) {
  try {
    // /categories/getAllCategories 엔드포인트에 GET 요청 보내기
      const response = await axios.get(HOST + '/kiosk/getTagMenu');
       console.log("API Response:", response.data);  // Add this line to log the API response
    let tagMenuData = [];
    // 응답에서 카테고리 데이터 추출
    const responseData = response.data;
       console.log("API Response:", response.data);  // Add this line to log the API response
    responseData.forEach(item => {
      // 원하는 형태로 변환하여 객체 생성

      const setTagMenu = {
         productId: item.ProductNO,
         tagId: item.TagNo,
         orderNo: item.orderNo,
          //mariaDB는 1/0 으로 바꾸기에 이렇게 지속적인 변경이 필요하다.
      };

      tagMenuData.push(setTagMenu);
  });
    // 받아온 카테고리 데이터를 store에 저장하기 위해 mutation 호출
    commit('setTagMenu', tagMenuData);
  } catch (error) {
    console.error('카테고리 데이터를 불러오는 중 오류 발생:', error);
  }
},
   
  },
  getters: {
    // 모든 옵션 반환
    allOptions: state => state.options,
  },
};

export default kioskModule;
