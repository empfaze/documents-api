import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Template } from './template';

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
