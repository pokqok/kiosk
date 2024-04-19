// src/entity/Payment.js

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Payment',
  tableName: 'PAYMENT',
  columns: {
    PayCode: {
      primary: true,
      type: 'varchar',
      length: 100,
    },
    OrderNO: {
      type: 'int',
      nullable: false,
    },
    OrderBY: {
      type: 'varchar',
      length: 20,
      nullable: false,
    },
    PayDate: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
    },
    Amount: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: false,
    },
    DepoName: {
      type: 'varchar',
      length: 20,
      nullable: true,
    },
    DepoBank: {
      type: 'varchar',
      length: 20,
      nullable: true,
    },
    DepoPhone: {
      type: 'varchar',
      length: 20,
      nullable: true,
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
  },
});
