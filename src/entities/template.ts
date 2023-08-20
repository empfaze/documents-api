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
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(
    () => TemplateAttributeField,
    (templateAttributeField) => templateAttributeField.templates,
    { eager: true },
  )
  @JoinTable()
  attributeFields: TemplateAttributeField[];

  @OneToMany(() => Document, (document) => document.template)
  documents: Document[];
}

@Entity()
export class TemplateAttributeField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @ManyToMany(() => Template, (template) => template.attributeFields)
  templates: Template[];
}
