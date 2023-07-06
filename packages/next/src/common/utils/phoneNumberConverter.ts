export function phoneNumberConverter(phoneNumber: string) {
  // Convert the number to a string
  const str = phoneNumber.toString();

  // Check that the length is correct
  if (str.length !== 10) {
    return 'Invalid phone number length. The number should have 10 digits.';
  }

  // Insert the formatting
  const formattedNumber = `+1 (${str.slice(0, 3)}) ${str.slice(
    3,
    6,
  )} ${str.slice(6)}`;

  return formattedNumber;
}
