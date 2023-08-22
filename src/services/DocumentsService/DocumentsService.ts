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
import { CreateDocumentDto, UpdateDocumentDto } from '../../dto';
import {
  areAttributeFieldsValid,
  isAttributeValueValid,
  mapAttributeTypeToEntity,
  mapAttributeValueToEntity,
} from '../../utils';

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
  }: CreateDocumentDto): Promise<Document> {
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

      const existingDocument = await this.databaseService.client
        .getRepository(Document)
        .findOne({
          where: {
            name,
          },
        });

      if (existingDocument) {
        throw new Error('Document with such name already exists');
      }

      if (attributeFields.length !== existingTemplate.attributeFields.length) {
        throw new Error('Incorrect number of attribute fields');
      }

      if (
        !areAttributeFieldsValid(
          existingTemplate.attributeFields,
          attributeFields,
        )
      ) {
        throw new Error('Some of attribute field values have incorrect types');
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
      }

      if (numberAttributeFields.length) {
        await this.databaseService.client
          .getRepository(DocumentNumberAttributeField)
          .save(numberAttributeFields);
      }

      if (stringAttributeFields.length) {
        await this.databaseService.client
          .getRepository(DocumentStringAttributeField)
          .save(stringAttributeFields);
      }

      if (dateAttributeFields.length) {
        await this.databaseService.client
          .getRepository(DocumentDateAttributeField)
          .save(dateAttributeFields);
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
    documentId,
    templateId,
    name,
    attributeFields,
  }: UpdateDocumentDto): Promise<Document> {
    try {
      if (!name && !attributeFields) {
        throw new Error(
          'You must enter either new name or new attribute fields to update the document',
        );
      }

      const existingTemplate = await this.databaseService.client
        .getRepository(Template)
        .findOne({
          where: {
            id: templateId,
          },
        });

      if (!existingTemplate) {
        throw new Error('Template with such id does not exist');
      }

      const existingDocument = await this.databaseService.client
        .getRepository(Document)
        .findOne({
          where: {
            id: documentId,
          },
        });

      if (!existingDocument) {
        throw new Error('Document with such name does not exist');
      }

      if (attributeFields) {
        for (const attribute of attributeFields) {
          const AttributeFieldEntity = mapAttributeTypeToEntity(attribute)!;

          const existingAttributeField = await this.databaseService.client
            .getRepository(AttributeFieldEntity)
            .findOne({
              where: {
                id: attribute.id,
              },
              relations: {
                document: true,
              },
            });

          if (!existingAttributeField) {
            throw new Error('Some of the entered fields do not exist');
          }

          if (existingAttributeField.document.id !== documentId) {
            throw new Error('Attribute field does not belong to this document');
          }

          if (!isAttributeValueValid(attribute.value, attribute.type)) {
            throw new Error('Attribute field value must have the same type');
          }

          await this.databaseService.client
            .createQueryBuilder()
            .update(AttributeFieldEntity)
            .set({ value: attribute.value })
            .where('id = :id', { id: attribute.id })
            .execute();
        }
      }

      if (name) {
        await this.databaseService.client
          .createQueryBuilder()
          .update(Document)
          .set({ name })
          .where('id = :id', { id: documentId })
          .execute();
      }

      return this.databaseService.client.getRepository(Document).findOne({
        where: {
          id: documentId,
        },
      }) as Promise<Document>;
    } catch (error) {
      throw new Error((error as Error).message);
    }
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
