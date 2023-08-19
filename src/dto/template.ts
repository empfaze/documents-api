import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

class AttributeField {
  @IsDefined({ message: 'Attribute name must be defined' })
  @IsString({ message: 'Attribute name must be a string' })
  name: string;

  @IsDefined({ message: 'Attribute type must be defined' })
  @IsString({ message: 'Attribute type must be a string' })
  @Matches(/string|date|number/, {
    message:
      'Attribute type must be one of the following types: "date", "number", "string"',
  })
  type: string;
}

export class TemplateDto {
  @IsDefined({ message: 'Template name must be defined' })
  @IsString({ message: 'Template name must be a string' })
  name: string;

  @IsDefined({ message: 'Attribute fields must be defined' })
  @IsArray({ message: 'Attribute fields must be an array' })
  @ArrayNotEmpty({
    message: 'Attribute fields must contain at least one field',
  })
  @ValidateNested({ each: true })
  @Type(() => AttributeField)
  attributeFields: AttributeField[];
}
