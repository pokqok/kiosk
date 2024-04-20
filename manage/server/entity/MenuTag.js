// src/entity/MenuTag.js

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'MenuTag',
  tableName: 'MENUTAG',
  columns: {
    ProductNO: {
      primary: true,
      type: 'int',
    },
    TagNo: {
      primary: true,
      type: 'int',
    },
  },
  relations: {
    product: {
      type: 'many-to-one',
      target: 'Product',
      joinColumn: {
        name: 'ProductNO',
        referencedColumnName: 'ProductNO',
      },
    },
    tag: {
      type: 'many-to-one',
      target: 'Tag',
      joinColumn: {
        name: 'TagNo',
        referencedColumnName: 'TagNO',
      },
    },
  },
});
