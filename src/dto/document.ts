import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  Validate,
  ValidateNested,
  ValidatorConstraintInterface,
} from 'class-validator';

export class IsAttributeValue implements ValidatorConstraintInterface {
  validate(value: any) {
    if (
      typeof value !== 'string' ||
      typeof value !== 'number' ||
      !((value as any) instanceof Date)
    ) {
      return false;
    }

    return true;
  }
}

class AttributeField {
  @IsDefined({ message: 'Attribute name must be defined' })
  @IsString({ message: 'Attribute name must be a string' })
  name: string;

  @IsDefined({ message: 'Attribute value must be defined' })
  @Validate(IsAttributeValue, {
    message:
      'Value must be one of the following types: "string", "number", "date"',
  })
  value: string | Date | number;
}

class Template {
  @IsDefined({ message: 'Template id must be defined' })
  @IsNumber({}, { message: 'Template id must be a number' })
  id: number;

  @IsDefined({ message: 'Template name must be defined' })
  @IsString({ message: 'Template name must be a string' })
  name: string;
}

export class DocumentDto {
  @IsDefined({ message: 'Document name must be defined' })
  @IsString({ message: 'Document name must be a string' })
  name: string;

  @IsDefined({ message: 'Template field must be defined' })
  @IsObject({ message: 'Template field must be an object' })
  @IsNotEmptyObject({}, { message: 'Template field must not be empty' })
  @ValidateNested()
  @Type(() => Template)
  template: Template;

  @IsDefined({ message: 'Attribute fields must be defined' })
  @IsArray({ message: 'Attribute fields must be an array' })
  @ArrayNotEmpty({
    message: 'Attribute fields must contain at least one field',
  })
  @ValidateNested({ each: true })
  @Type(() => AttributeField)
  attributeFields: AttributeField[];
}
