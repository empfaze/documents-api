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

  @ManyToOne(() => Template, (template) => template.documents, { eager: true })
  template: Template;

  @OneToMany(
    () => DocumentNumberAttributeField,
    (documentNumberAttributeField) => documentNumberAttributeField.document,
    { eager: true },
  )
  numberAttributeFields: DocumentNumberAttributeField[];

  @OneToMany(
    () => DocumentStringAttributeField,
    (documentStringAttributeField) => documentStringAttributeField.document,
    { eager: true },
  )
  stringAttributeFields: DocumentStringAttributeField[];

  @OneToMany(
    () => DocumentDateAttributeField,
    (documentDateAttributeField) => documentDateAttributeField.document,
    { eager: true },
  )
  dateAttributeFields: DocumentDateAttributeField[];
}

@Entity()
export class DocumentNumberAttributeField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: number;

  @ManyToOne(() => Document, (document) => document.numberAttributeFields, {
    onDelete: 'CASCADE',
  })
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

  @ManyToOne(() => Document, (document) => document.stringAttributeFields, {
    onDelete: 'CASCADE',
  })
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

  @ManyToOne(() => Document, (document) => document.dateAttributeFields, {
    onDelete: 'CASCADE',
  })
  document: Document;
}
