// src/entity/Tag.js

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Tag',
  tableName: 'TAG',
  columns: {
    TagNO: {
      primary: true,
      type: 'int',
    },
    TagName: {
      type: 'varchar',
      length: 100,
    },
    TagAlias: {
      type: 'varchar',
      length: 200,
    },
  },
});
