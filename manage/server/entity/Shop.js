// src/entity/Shop.js

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Shop',
  tableName: 'SHOP',
  columns: {
    ShopID: {
      primary: true,
      type: 'varchar',
      length: 20,
    },
    ShopName: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    UserID: {
      type: 'varchar',
      length: 20,
    },
  },
  relations: {
    manager: {
      type: 'many-to-one',
      target: 'Manager',
      joinColumn: {
        name: 'UserID',
        referencedColumnName: 'UserID',
      },
    },
  },
});
