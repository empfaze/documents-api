import { ResponseDocumentDto } from '../dto';
import { Document } from '../entities';

export const transformDocumentResponse = (
  document: Document,
): ResponseDocumentDto => ({
  id: document.id,
  name: document.name,
  template: document.template,
  attributeFields: [
    ...document.dateAttributeFields!,
    ...document.numberAttributeFields!,
    ...document.stringAttributeFields!,
  ],
});
