/* eslint-disable @typescript-eslint/no-use-before-define */
export const convertInchesToCentimeters = (
  inches: number | string | null,
): string => {
  if (!inches) {
    return '0';
  }
  const centimeters = (Number(inches) * 2.54).toString();
  return formatNumber(centimeters);
};

export const convertCentimetersToInches = (
  centimeters: number | string | null,
): string => {
  if (!centimeters) {
    return '0';
  }
  const inches = (Number(centimeters) / 2.54).toString();
  return formatNumber(inches);
};

function formatNumber(num: string) {
  const floatNum = parseFloat(num);

  if ((Math.round(floatNum * 10) / 10) % 1 === 0) {
    return parseInt(floatNum.toString(), 10).toString();
  }

  return floatNum.toFixed(1);
}
