import { UpdateDocumentAttributeField } from '../dto';
import {
  DocumentDateAttributeField,
  DocumentNumberAttributeField,
  DocumentStringAttributeField,
} from '../entities';

export const mapAttributeTypeToEntity = ({
  type,
}: UpdateDocumentAttributeField) => {
  switch (type) {
    case 'number':
      return DocumentNumberAttributeField;
    case 'string':
      return DocumentStringAttributeField;
    case 'date':
      return DocumentDateAttributeField;
  }
};
