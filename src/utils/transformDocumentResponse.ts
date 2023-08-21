import { Document } from '../entities';

export const transformDocumentResponse = (document: Partial<Document>) => {
  const transformedDocument = {
    ...document,
    attributeFields: [
      ...document.dateAttributeFields!,
      ...document.numberAttributeFields!,
      ...document.stringAttributeFields!,
    ],
  };

  delete transformedDocument.dateAttributeFields;
  delete transformedDocument.numberAttributeFields;
  delete transformedDocument.stringAttributeFields;

  return transformedDocument;
};
