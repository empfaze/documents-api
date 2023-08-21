import { CreateDocumentAttributeField } from '../dto';
import {
  DocumentDateAttributeField,
  DocumentNumberAttributeField,
  DocumentStringAttributeField,
} from '../entities';

export const mapAttributeValueToEntity = ({
  value,
}: CreateDocumentAttributeField) => {
  if (typeof value === 'number') {
    return DocumentNumberAttributeField;
  }

  if (typeof value === 'string' && Date.parse(value)) {
    return DocumentDateAttributeField;
  }

  if (typeof value === 'string') {
    return DocumentStringAttributeField;
  }
};
