import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDefined,
  IsNumber,
  IsString,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsAttributeValue implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (args.constraints.includes(typeof value)) {
      return true;
    }

    return false;
  }
}

export class DocumentAttributeField {
  @IsDefined({ message: 'Attribute name must be defined' })
  @IsString({ message: 'Attribute name must be a string' })
  name: string;

  @IsDefined({ message: 'Attribute value must be defined' })
  @Validate(IsAttributeValue, ['string', 'number'], {
    message:
      'Value must be one of the following types: "string", "number", "date"',
  })
  value: string | number;
}

export class DocumentDto {
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
  @Type(() => DocumentAttributeField)
  attributeFields: DocumentAttributeField[];
}
