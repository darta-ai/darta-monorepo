export const convertInchesToCentimeters = (
  inches: number | string | null,
): string => {
  if (!inches) {
    return '0';
  }
  const centimeters = Number(inches) * 2.54;
  return (
    Math.floor(centimeters) === centimeters
      ? centimeters
      : centimeters.toFixed(2)
  ).toString();
};

export const convertCentimetersToInches = (
  centimeters: number | string | null,
): string => {
  if (!centimeters) {
    return '0';
  }
  const inches = Number(centimeters) / 2.54;
  return (
    Math.floor(inches) === inches ? inches : inches.toFixed(2)
  ).toString();
};
