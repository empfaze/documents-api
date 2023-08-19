import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Document } from './document';

@Entity()
export class DocumentAttributeField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: string;

  @ManyToOne(() => Document, (document) => document.attributeFields)
  document: Document;
}
