import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Document } from './document';

@Entity()
export class AttributeField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @ManyToMany(() => Template, (template) => template.attributeFields)
  templates: Template[];
}

@Entity()
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(
    () => AttributeField,
    (attributeField) => attributeField.templates,
  )
  @JoinTable()
  attributeFields: AttributeField[];

  @OneToMany(() => Document, (document) => document.template)
  documents: Document[];
}
