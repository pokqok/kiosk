//각 태그의 상세 데이터 저장//const axios = require('axios');
let option = [
  //온도
    {
      id: 1,
      name: '뜨겁게',
      price: 0,
      tag: 1,
      image: '',
      alias: '',
      orderNo: 1,
      duplicate: false, //중복 여부, 기본값은 그냥 false로 해둠
    },
    {
      id: 2,
      name: '차갑게',
      price: 0,
      tag: 1,
      image: '',
      alias: '',
      orderNo: 2,
      duplicate: false,
    },
    //시럽? 휘핑
    {
      id: 3,
      name: '시럽없음',
      price: 0,
      tag: 2,
      image: '',
      alias: '',
      orderNo: 1,
      duplicate: false,
    },
    {
      id: 4,
      name: '시럽적게',
      price: 0,
      tag: 2,
      image: '',
      alias: '',
      orderNo: 2,
      duplicate: false,
    },
    {
      id: 5,
      name: '시럽많이',
      price: 0,
      tag: 2,
      image: '',
      alias: '',
      orderNo: 3,
      duplicate: false,
    },
    //샷
    {
      id: 9,
      name: '원샷',
      price: 0,
      tag: 3,
      image: '',
      alias: '',
      orderNo: 1,
      duplicate: false,
    },
    {
      id: 10,
      name: '투샷',
      price: 0,
      tag: 3,
      image: '',
      alias: '',
      orderNo: 2,
      duplicate: false,
    },
    {
      id: 11,
      name: '쓰리샷',
      price: 0,
      tag: 3,
      image: '',
      alias: '',
      orderNo: 3,
      duplicate: false,
    },
    {
      id: 12,
      name: '크림 없음',
      price: 0,
      tag: 4,
      image: '',
      alias: '',
      orderNo: 1,
      duplicate: false,
    },
    {
      id: 13,
      name: '크림 조금',
      price: 0,
      tag: 4,
      image: '',
      alias: '',
      orderNo: 2,
      duplicate: false,
    },
    {
      id: 14,
      name: '크림 많이',
      price: 1000,
      tag: 4,
      image: '',
      alias: '',
      orderNo: 3,
      duplicate: false,
    },
    {
      id: 15,
      name: '시나몬 가루',
      price: 0,
      tag: 5,
      image: '',
      alias: '',
      orderNo: 1,
      duplicate: true,
    },
    {
      id: 16,
      name: '초콜릿 칩',
      price: 0,
      tag: 5,
      image: '',
      alias: '',
      orderNo: 2,
      duplicate: true,
    },
    {
      id: 17,
      name: '슈가 파우더',
      price: 0,
      tag: 5,
      image: '',
      alias: '',
      orderNo: 3,
      duplicate: true,
    },
    {
      id: 18,
      name: '달고나 가루',
      price: 0,
      tag: 5,
      image: '',
      alias: '',
      orderNo: 4,
      duplicate: true,
    },
  ];

/* DB 형식

              id: item.DetNO,
              name: item.DetName,
              price: item.AddPrice,
              tag: item.TagNO,
              image: item.DetImage,
              alias: item.DetAlias,
              orderNo: item.orderNo,
              duplicate: item.isDup, //중복여부, true면 중복 허용 = 체크박스로 구현

*/
export {option};