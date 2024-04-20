// src/entity/OrderItem.js

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'OrderItem',
  tableName: 'ORDERITEM',
  columns: {
    OrderItemNO: {
      primary: true,
      type: 'int',
    },
    ItemCost: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: false,
    },
    ItemCount: {
      type: 'int',
      nullable: false,
    },
    OrderNO: {
      type: 'int',
      nullable: false,
    },
    ProductNo: {
      type: 'int',
      nullable: false,
    },
  },
  relations: {
    order: {
      target: 'MenuOrder',
      type: 'many-to-one',
      joinColumn: true,
      onDelete: 'CASCADE',
      nullable: false,
    },
    product: {
      target: 'Product',
      type: 'many-to-one',
      joinColumn: true,
      onDelete: 'CASCADE',
      nullable: false,
    },
  },
});
