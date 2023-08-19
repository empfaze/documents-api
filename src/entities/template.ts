import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Document } from './document';
import { TemplateAttributeField } from './templateAttributeField';

@Entity()
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(
    () => TemplateAttributeField,
    (attributeField) => attributeField.templates,
  )
  @JoinTable()
  attributeFields: TemplateAttributeField[];

  @OneToMany(() => Document, (document) => document.template)
  documents: Document[];
}
