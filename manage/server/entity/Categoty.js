// src/entity/Category.js

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Category',
  tableName: 'CATEGORY',
  columns: {
    CategoryNO: {
      primary: true,
      type: 'int',
      generated: true,
    },
    CategoryName: {
      type: 'varchar',
    },
    CategoryAlias: {
      type: 'varchar',
    },
  },
});
