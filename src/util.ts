/**
 * Takes a number, converts it to binary and makes sure it is padded to a
 * length of 8 (i.e. a byte). If the input is longer than 8 digits in binary,
 * it is returned unchanged.
 *
 * @param num Number to be converted
 * @returns Binary number as a string of length 8
 */
export function toPaddedBinary(num: number): string {
  return num.toString(2).padStart(8, "0");
}

/**
 * Takes a string, reverses it and returns the result.
 *
 * @param str String to reverse
 * @returns The input string reversed
 */
export function reverse(str: string): string {
  return str.split("").reverse().join("");
}

/**
 * Converts a given number to hexadecimal notation with leading '0x'. If the
 * given number is less than 16, a leading zero is appended to the output.
 *
 * @param byte Number to convert to hex
 * @returns A hex string corresponding to the input number
 */
export function toHex(byte: number): string {
  const hexStr = byte.toString(16).toUpperCase();
  return (hexStr.length === 1) ? `0x0${hexStr}` : `0x${hexStr}`;
}
