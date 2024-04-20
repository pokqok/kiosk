// src/entity/MenuOrder.js

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'MenuOrder',
  tableName: 'MENUORDER',
  columns: {
    OrderNO: {
      primary: true,
      type: 'int',
    },
    Cost: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: true,
    },
    OrderDate: {
      type: 'date',
      createDate: true,
    },
    Package: {
      type: 'varchar',
      length: 20,
      nullable: false,
    },
    OrderState: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    OrderDetail: {
      type: 'varchar',
      length: 200,
      nullable: true,
    },
  },
});
