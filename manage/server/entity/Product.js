/*
//ts 코드임
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  productno: number;

  @Column()
  productname: string;

  @Column()
  price: number;
}
*/

// src/entity/Product.js

const { EntitySchema } = require('typeorm');
const { Category } = require('./Category');

module.exports = new EntitySchema({
  name: 'Product',
  tableName: 'PRODUCT',
  columns: {
    ProductNO: {
      primary: true,
      type: 'int',
      generated: true,
    },
    ProductName: {
      type: 'varchar',
      nullable: false,
    },
    Price: {
      type: 'decimal',
      precision: 10,
      scale: 2,
      nullable: false,
    },
    CategoryNO: {
        type: "int",
        nullable: true
    },
    ProductDetail: {
      type: 'varchar',
      nullable: true,
    },
    ProductImage: {
      type: 'varchar',
      nullable: true,
    },
    ProductAlias: {
      type: 'varchar',
      nullable: true,
    },
  },
  relations: {
    Category: {
      type: 'many-to-one',
      target: 'Category',
      joinColumn: true,
      eager: true,
    },
  },
});
