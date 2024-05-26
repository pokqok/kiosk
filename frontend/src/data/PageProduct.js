let product = [
    {
      id: 1,
      name: '아메리카노',
      price: 1500,
      category: 1,
      detail: '에스프레소에 물을 탔습니다.',
      image: 'americano.jpg',
      alias: '아아, 쓴거, 블랙 커피, 블랙',
      isOn: true, //키오스크 표시 여부, 아직 고려 안함
    },
    {
      id: 2,
      name: '카페라떼',
      price: 3000,
      category: 1,
      detail: '에스프레소에 우유를 탔습니다.',
      image: 'latte.png',
      alias: '',
      isOn: true,
    },
    {
      id: 3,
      name: '말차',
      price: 4000,
      category: 1,
      detail: '녹차를 우유에 탔습니다',
      image: 'maltcha.png',
      alias: '',
      isOn: true,
    },
    {
      id: 4,
      name: '복숭아 에이드',
      price: 3000,
      category: 2,
      detail: '',
      image: 'peachade.png',
      alias: '',
      isOn: true,
    },
    {
      id: 5,
      name: '레몬 에이드',
      price: 3000,
      category: 2,
      detail: '',
      image: 'lemonade.jpg',
      alias: '',
      isOn: true,
    },
    {
      id: 6,
      name: '보리차',
      price: 1500,
      category: 3,
      detail: '',
      image: 'boricha.jpg',
      alias: '',
      isOn: true,
    },
    {
      id: 7,
      name: '민트티',
      price: 2000,
      category: 3,
      detail: '',
      image: 'minttea.jpg',
      alias: '',
      isOn: true,
    },
  ]
/*
            id: item.ProductNO,
            name: item.ProductName,
            price: item.Price,
            category: item.CategoryNO,
            detail: item.ProductDetail,
            image: item.ProductImage,
            alias: item.CategoryAlias,
            isOn: item.IsOn == 1 ? true : false

*/
export {product};