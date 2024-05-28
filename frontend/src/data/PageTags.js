//const axios = require('axios');
let tag = [
    {  
      id: 1,
      name: '온도',
      alias: '뜨겁게, 차갑게',
      description: '뜨겁게, 차갑게를 결정합니다',
      isRequired: true, //무조건 선택해야 하는가
      isOn: true, //표시 여부
    },
    {  
      id: 2,
      name: '시럽',
      alias: '달기, 설탕',
      description: '달기를 결정합니다.',
      isRequired: true, 
      isOn: true, 
    },
    {  
      id: 3,
      name: '샷',
      alias: '진하게, 진함, 쓰기',
      description: '쓰기를 결정합니다.',
      isRequired: true, 
      isOn: true, 
    },
    {  
      id: 4,
      name: '휘핑 크림',
      alias: '크림',
      description: '크림을 추가할 수 있습니다.',
      isRequired: true, 
      isOn: true, 
    },
    {  
      id: 5,
      name: '토핑',
      alias: '토핑, 재료',
      description: '위에 올릴 수 있는 추가 메뉴입니다.',
      isRequired: true, 
      isOn: true, 
    },
  ];

/*
  id: item.TagNO,
              name: item.TagName,
              alias: item.TagAlias,
              description: item.TagDet,
              isRequired: item.IsRequired == 1 ? true : false,
              isOn: item.IsOn == 1 ? true : false
*/
export {tag};