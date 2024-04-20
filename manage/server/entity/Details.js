// src/entity/Detail.js

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Detail',
  tableName: 'DETAILS',
  columns: {
    DetNO: {
      primary: true,
      type: 'int',
      generated: true,
    },
    DetName: {
      type: 'varchar',
      length: 100,
      nullable: false,
    },
    DetDescription: {
      type: 'varchar',
      length: 200,
      nullable: true,
    },
    AddPrice: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      default: 0,
    },
    TagNO: {
      type: 'int',
    },
    DetImage: {
      type: 'varchar',
      length: 200,
      nullable: true,
    },
    DetAlias: {
      type: 'varchar',
      length: 200,
      nullable: true,
    },
  },
  relations: {
    tag: {
      type: 'many-to-one',
      target: 'Tag',
      joinColumn: {
        name: 'TagNO',
        referencedColumnName: 'TagNO',
      },
    },
  },
});
