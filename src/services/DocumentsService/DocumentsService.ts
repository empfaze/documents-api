import { inject, injectable } from 'inversify';
import { IDocumentsService, INVERSIFY_TYPES } from '../../types';
import { Document } from '../../entities';
import { DatabaseService } from '../DatabaseService';
import { DocumentDto } from '../../dto';

@injectable()
export class DocumentsService implements IDocumentsService {
  constructor(
    @inject(INVERSIFY_TYPES.DatabaseService)
    private databaseService: DatabaseService,
  ) {}

  read() {
    return this.databaseService.client.getRepository(Document).find({
      relations: {
        attributeFields: true,
        template: true,
      },
    });
  }

  async create({
    name,
    templateId,
    attributeFields,
  }: DocumentDto): Promise<Document | null> {
    return null;
  }

  async update({
    name,
    templateId,
    attributeFields,
  }: DocumentDto): Promise<Document | null> {
    return null;
  }

  async delete(id: number) {
    return null;
  }
}
