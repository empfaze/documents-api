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
  }: TemplateDto): Promise<null | Template> {
    const template = await this.databaseService.client
      .getRepository(Template)
      .findOne({
        where: {
          name,
        },
      });

    if (template) {
      return null;
    }

    const templateAttributeFields = attributeFields.map(({ name, type }) => {
      const field = new TemplateAttributeField();

      field.name = name;
      field.type = type;

      return field;
    });

    const templateModel = new Template();

    templateModel.name = name;
    templateModel.attributeFields = templateAttributeFields;

    await this.databaseService.client
      .getRepository(TemplateAttributeField)
      .save(templateAttributeFields);

    return this.databaseService.client
      .getRepository(Template)
      .save(templateModel);
  }
}
