import { TemplateDto } from '../dto';
import { Template } from '../entities';

export interface ITemplatesService {
  create: (dto: TemplateDto) => Promise<Template>;
  read: () => Promise<Template[]>;
}
