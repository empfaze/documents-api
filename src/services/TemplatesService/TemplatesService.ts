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

  read(): Promise<Template[]> {
    return this.databaseService.client.getRepository(Template).find({
      relations: {
        attributeFields: true,
      },
    });
  }

  async create({ name, attributeFields }: TemplateDto): Promise<Template> {
    try {
      const existingTemplate = await this.databaseService.client
        .getRepository(Template)
        .findOne({
          where: {
            name,
          },
        });

      if (existingTemplate) {
        throw new Error('Template with such name already exists');
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

      const template = new Template();

      template.name = name;
      template.attributeFields = [
        ...existingAttributeFields,
        ...newAttributeFields,
      ];

      await this.databaseService.client
        .getRepository(TemplateAttributeField)
        .save(newAttributeFields);

      return this.databaseService.client.getRepository(Template).save(template);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
