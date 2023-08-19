import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Template } from './template';

@Entity()
export class AttributeField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: string | number | Date;

  @ManyToOne(() => Document, (document) => document.attributeFields)
  document: Document;
}

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Template, (template) => template.documents)
  template: Template;

  @OneToMany(() => AttributeField, (attributeField) => attributeField.document)
  attributeFields: AttributeField[];
}
