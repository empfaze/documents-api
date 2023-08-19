import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Template } from './template';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Template, (template) => template.documents)
  template: Template;

  @OneToMany(
    () => DocumentNumberAttributeField,
    (documentNumberAttributeField) => documentNumberAttributeField.document,
  )
  @OneToMany(
    () => DocumentStringAttributeField,
    (documentStringAttributeField) => documentStringAttributeField.document,
  )
  @OneToMany(
    () => DocumentDateAttributeField,
    (documentDateAttributeField) => documentDateAttributeField.document,
  )
  attributeFields: Array<
    | DocumentStringAttributeField
    | DocumentNumberAttributeField
    | DocumentDateAttributeField
  >;
}

@Entity()
export class DocumentNumberAttributeField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: number;

  @ManyToOne(() => Document, (document) => document.attributeFields)
  document: Document;
}

@Entity()
export class DocumentStringAttributeField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: string;

  @ManyToOne(() => Document, (document) => document.attributeFields)
  document: Document;
}

@Entity()
export class DocumentDateAttributeField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: Date;

  @ManyToOne(() => Document, (document) => document.attributeFields)
  document: Document;
}
