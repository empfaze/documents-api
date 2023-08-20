import { inject, injectable } from 'inversify';
import { IDocumentsService, INVERSIFY_TYPES } from '../../types';
import {
  Document,
  DocumentNumberAttributeField,
  Template,
  DocumentDateAttributeField,
  DocumentStringAttributeField,
} from '../../entities';
import { DatabaseService } from '../DatabaseService';
import { DocumentAttributeField, DocumentDto } from '../../dto';

const mapAttributeValueToEntity = ({ value }: DocumentAttributeField) => {
  if (typeof value === 'number') {
    return DocumentNumberAttributeField;
  }

  if (typeof value === 'string' && Date.parse(value)) {
    return DocumentDateAttributeField;
  }

  if (typeof value === 'string') {
    return DocumentStringAttributeField;
  }
};

@injectable()
export class DocumentsService implements IDocumentsService {
  constructor(
    @inject(INVERSIFY_TYPES.DatabaseService)
    private databaseService: DatabaseService,
  ) {}

  read(): Promise<Document[]> {
    return this.databaseService.client.getRepository(Document).find();
  }

  async create({
    name,
    templateId,
    attributeFields,
  }: DocumentDto): Promise<Document> {
    try {
      const existingTemplate = await this.databaseService.client
        .getRepository(Template)
        .findOne({
          where: {
            id: templateId,
          },
          relations: {
            attributeFields: true,
          },
        });

      if (!existingTemplate) {
        throw new Error('Template with such id does not exist');
      }

      if (attributeFields.length !== existingTemplate.attributeFields.length) {
        throw new Error('Incorrect number of attribute fields');
      }

      const numberAttributeFields: DocumentNumberAttributeField[] = [];
      const stringAttributeFields: DocumentStringAttributeField[] = [];
      const dateAttributeFields: DocumentDateAttributeField[] = [];

      for (const attribute of attributeFields) {
        const AttributeFieldEntity = mapAttributeValueToEntity(attribute)!;
        const attributeField = new AttributeFieldEntity();

        attributeField.name = attribute.name;
        attributeField.value = attribute.value;

        switch (AttributeFieldEntity) {
          case DocumentNumberAttributeField:
            numberAttributeFields.push(
              attributeField as DocumentNumberAttributeField,
            );
            break;
          case DocumentStringAttributeField:
            stringAttributeFields.push(
              attributeField as DocumentStringAttributeField,
            );
            break;
          case DocumentDateAttributeField:
            dateAttributeFields.push(
              attributeField as DocumentDateAttributeField,
            );
            break;
        }

        await this.databaseService.client
          .getRepository(AttributeFieldEntity)
          // @ts-ignore
          .save(attributeField);
      }

      const document = new Document();

      document.name = name;
      document.template = existingTemplate;
      document.numberAttributeFields = numberAttributeFields;
      document.stringAttributeFields = stringAttributeFields;
      document.dateAttributeFields = dateAttributeFields;

      return this.databaseService.client.getRepository(Document).save(document);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async update({
    name,
    templateId,
    attributeFields,
  }: DocumentDto): Promise<Document | null> {
    return null;
  }

  async delete(id: string): Promise<void> {
    try {
      const existingDocument = await this.databaseService.client
        .getRepository(Document)
        .findOne({
          where: {
            id: Number(id),
          },
        });

      if (!existingDocument) {
        throw new Error('Document with such id does not exist');
      }

      await this.databaseService.client
        .getRepository(Document)
        .delete({ id: Number(id) });
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
