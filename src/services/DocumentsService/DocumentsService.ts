import { inject, injectable } from 'inversify';
import { IDocumentsService, INVERSIFY_TYPES } from '../../types';
import {
  Document,
  DocumentNumberAttributeField,
  Template,
  DocumentDateAttributeField,
  DocumentStringAttributeField,
  TemplateAttributeField,
} from '../../entities';
import { DatabaseService } from '../DatabaseService';
import {
  CreateDocumentAttributeField,
  CreateDocumentDto,
  UpdateDocumentAttributeField,
  UpdateDocumentDto,
} from '../../dto';

const mapAttributeValueToEntity = ({ value }: CreateDocumentAttributeField) => {
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

const mapAttributeTypeToEntity = ({ type }: UpdateDocumentAttributeField) => {
  switch (type) {
    case 'number':
      return DocumentNumberAttributeField;
    case 'string':
      return DocumentStringAttributeField;
    case 'date':
      return DocumentDateAttributeField;
  }
};

const areAttributeFieldsValid = (
  templateAttributes: TemplateAttributeField[],
  documentAttributes: CreateDocumentAttributeField[],
) =>
  documentAttributes.every(({ name, value }) => {
    let isValidAttribute = false;

    for (const attribute of templateAttributes) {
      if (name === attribute.name) {
        if (
          typeof value === 'string' &&
          attribute.type === 'date' &&
          Date.parse(value)
        ) {
          isValidAttribute = true;
        } else if (typeof value === attribute.type) {
          isValidAttribute = true;
        }
      }
    }

    return isValidAttribute;
  });

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
