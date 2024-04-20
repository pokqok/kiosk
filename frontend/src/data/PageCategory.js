//const axios = require('axios');
let CategoryData = [
    { id: 1, name: '태그 1' ,alias: 'tag1', isOn: false},
    { id: 2, name: '태그 2' ,alias: 'tag1', isOn: false},
    { id: 3, name: '태그 3' ,alias: 'tag1', isOn: false},
    { id: 4, name: '태그 4' ,alias: 'tag1', isOn: false},
    { id: 5, name: '태그 5' ,alias: 'tag1', isOn: false},
    { id: 6, name: '태그 6' ,alias: 'tag1', isOn: false},
    { id: 7, name: '태그 7' ,alias: 'tag1', isOn: false},
    { id: 8, name: '태그 8' ,alias: 'tag1', isOn: false},
  ];

/*
const applyCategorys = async (modifiedCategoryData) => {
  try {
    const response = await axios.post('/applyChanges', modifiedCategoryData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(response.data); // 서버에서 받은 응답 출력
  } catch (error) {
    console.error('변경사항 적용 중 오류 발생:', error);
  }
};*/

/*
const addNewCategory = (Categorys, newCategoryName) => {
  if (newCategoryName.trim() !== '') {
    const newCategory = {
      id: Categorys.length + 1,
      name: newCategoryName,
      alias: null,
      isOn: false,
    };
    Categorys.push(newCategory);
    return Categorys;
  }
  return Categorys; // 새로운 카테고리가 추가되지 않은 경우에도 원본 Categorys를 반환
};*/

//const deleteCatgory(Catgorys, CategoryID) => {};
//const changeCategory(Categorys, CategoryID) => {};
export {CategoryData};