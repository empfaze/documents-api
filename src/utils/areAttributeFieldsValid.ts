import { CreateDocumentAttributeField } from '../dto';
import { TemplateAttributeField } from '../entities';

export const areAttributeFieldsValid = (
  templateAttributes: TemplateAttributeField[],
  documentAttributes: CreateDocumentAttributeField[],
) =>
  documentAttributes.every(({ name, value }) => {
    let isValidAttribute = false;

    for (const attribute of templateAttributes) {
      if (name === attribute.name) {
        if (
          typeof value === 'string' &&
          attribute.type === 'date' &&
          Date.parse(value)
        ) {
          isValidAttribute = true;
        } else if (typeof value === attribute.type) {
          isValidAttribute = true;
        }
      }
    }

    return isValidAttribute;
  });
