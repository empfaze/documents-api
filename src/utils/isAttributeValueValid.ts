export const isAttributeValueValid = (
  value: string | number | Date,
  type: string,
) => {
  if (typeof value === 'string' && type === 'date' && Date.parse(value)) {
    return true;
  }

  if (typeof value === 'string' && type === 'string') {
    return true;
  }

  if (typeof value === 'number' && type === 'number') {
    return true;
  }

  return false;
};
