import { Document } from '../entities';
import { CreateDocumentDto, UpdateDocumentDto } from '../dto';

export interface IDocumentsService {
  create: (dto: CreateDocumentDto) => Promise<Document>;
  read: () => Promise<Document[]>;
  update: (dto: UpdateDocumentDto) => Promise<Document>;
  delete: (id: string) => void;
}
