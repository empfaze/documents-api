import { TemplateDto } from '../dto';
import { Template } from '../entities';

export interface ITemplatesService {
  create: (dto: TemplateDto) => Promise<Template | undefined>;
  read: () => Promise<Template[]>;
}
