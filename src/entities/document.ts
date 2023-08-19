import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Template } from './template';
import { DocumentAttributeField } from './documentAttributeField';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Template, (template) => template.documents)
  template: Template;

  @OneToMany(
    () => DocumentAttributeField,
    (attributeField) => attributeField.document,
  )
  attributeFields: DocumentAttributeField[];
}
