import { inject, injectable } from 'inversify';
import { INVERSIFY_TYPES, ITemplatesService } from '../../types';
import { Template, TemplateAttributeField } from '../../entities';
import { DatabaseService } from '../DatabaseService';
import { TemplateDto } from '../../dto';

@injectable()
export class TemplatesService implements ITemplatesService {
  constructor(
    @inject(INVERSIFY_TYPES.DatabaseService)
    private databaseService: DatabaseService,
  ) {}

  read() {
    return this.databaseService.client.getRepository(Template).find({
      relations: {
        attributeFields: true,
      },
    });
  }

  async create({
    name,
    attributeFields,
  }: TemplateDto): Promise<Template | null> {
    try {
      const existingTemplate = await this.databaseService.client
        .getRepository(Template)
        .findOne({
          where: {
            name,
          },
        });

      if (existingTemplate) {
        return null;
      }

      const existingAttributeFields: TemplateAttributeField[] = [];
      const newAttributeFields: TemplateAttributeField[] = [];

      for (const attribute of attributeFields) {
        const existingAttributeField = await this.databaseService.client
          .getRepository(TemplateAttributeField)
          .findOne({
            where: {
              name: attribute.name,
              type: attribute.type,
            },
          });

        if (existingAttributeField) {
          existingAttributeFields.push(existingAttributeField);
        } else {
          const newAttributeField = new TemplateAttributeField();

          newAttributeField.name = attribute.name;
          newAttributeField.type = attribute.type;

          newAttributeFields.push(newAttributeField);
        }
      }

      const templateModel = new Template();

      templateModel.name = name;
      templateModel.attributeFields = [
        ...existingAttributeFields,
        ...newAttributeFields,
      ];

      await this.databaseService.client
        .getRepository(TemplateAttributeField)
        .save(newAttributeFields);

      return this.databaseService.client
        .getRepository(Template)
        .save(templateModel);
    } catch (error) {
      throw new Error('An error occured while creating entities');
    }
  }
}
