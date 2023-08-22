import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsNecessaryType implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (args.constraints.includes(typeof value)) {
      return true;
    }

    return false;
  }
}

export class CreateDocumentAttributeField {
  @IsDefined({ message: 'Attribute name must be defined' })
  @IsString({ message: 'Attribute name must be a string' })
  name: string;

  @IsDefined({ message: 'Attribute value must be defined' })
  @Validate(IsNecessaryType, ['string', 'number'], {
    message:
      'Value must be one of the following types: "string", "number", "date"',
  })
  value: string | number;
}

export class CreateDocumentDto {
  @IsDefined({ message: 'Document name must be defined' })
  @IsString({ message: 'Document name must be a string' })
  name: string;

  @IsDefined({ message: 'Template id must be defined' })
  @IsNumber({}, { message: 'Template id must be a number' })
  templateId: number;

  @IsDefined({ message: 'Attribute fields must be defined' })
  @IsArray({ message: 'Attribute fields must be an array' })
  @ArrayNotEmpty({
    message: 'Attribute fields must contain at least one field',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentAttributeField)
  attributeFields: CreateDocumentAttributeField[];
}

export class UpdateDocumentAttributeField {
  @IsDefined({ message: 'Attribute id must be defined' })
  @IsNumber({}, { message: 'Attribute id must be a number' })
  id: number;

  @IsDefined({ message: 'Attribute value must be defined' })
  @Validate(IsNecessaryType, ['string', 'number'], {
    message:
      'Value must be one of the following types: "string", "number", "date"',
  })
  value: string | number;

  @IsDefined({ message: 'Attribute type must be defined' })
  @IsString({ message: 'Attribute type must be a string' })
  @Matches(/string|date|number/, {
    message:
      'Attribute type must be one of the following types: "date", "number", "string"',
  })
  type: string;
}

export class UpdateDocumentDto {
  @IsDefined({ message: 'Document id must be defined' })
  @IsNumber({}, { message: 'Document id must be a number' })
  documentId: number;

  @IsDefined({ message: 'Document id must be defined' })
  @IsNumber({}, { message: 'Document id must be a number' })
  templateId: number;

  @IsOptional()
  @IsString({ message: 'Document name must be a string' })
  name?: string;

  @IsOptional()
  @IsArray({ message: 'Attribute fields must be an array' })
  @ArrayNotEmpty({
    message: 'Attribute fields must contain at least one field',
  })
  @ValidateNested({ each: true })
  @Type(() => UpdateDocumentAttributeField)
  attributeFields?: UpdateDocumentAttributeField[];
}

interface TemplateResponse {
  id: number;
  name: string;
}

interface AttributeFieldResponse {
  id: number;
  name: string;
  value: string | number | Date;
}

export class ResponseDocumentDto {
  id: number;

  name: string;

  template: TemplateResponse;

  attributeFields: AttributeFieldResponse[];
}
