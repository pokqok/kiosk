// src/entity/Manager.js

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Manager',
  tableName: 'MANAGER',
  columns: {
    UserID: {
      primary: true,
      type: 'varchar',
      length: 20,
    },
    Password: {
      type: 'varchar',
      length: 20,
    },
    UserPhone: {
      type: 'varchar',
      length: 20,
    },
  },
});
