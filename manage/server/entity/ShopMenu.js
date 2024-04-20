// src/entity/ShopMenu.js

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'ShopMenu',
  tableName: 'SHOPMENU',
  columns: {
    ShopID: {
      primary: true,
      type: 'varchar',
      length: 20,
    },
    ProductNO: {
      primary: true,
      type: 'int',
    },
  },
  relations: {
    shop: {
      type: 'many-to-one',
      target: 'Shop',
      joinColumn: {
        name: 'ShopID',
        referencedColumnName: 'ShopID',
      },
    },
    product: {
      type: 'many-to-one',
      target: 'Product',
      joinColumn: {
        name: 'ProductNO',
        referencedColumnName: 'ProductNO',
      },
    },
  },
});
