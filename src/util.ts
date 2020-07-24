/**
 * Pads the given string to the left with the given pad character until the pad
 * lenght is reached. If a string that is equal or longer to the target length
 * is passed in, the string is returned unchanged.
 *
 * @param str String to pad
 * @param targetLen Target length
 * @param pad Pad character
 * @returns The padded string
 */
function padStart(str: string, targetLen: number, pad: string): string {
  // Return string if it is longer or equal to targetLen
  if (str.length >= targetLen) {
    return str;
  }

  // Initialise padding array to required length
  const padLen = targetLen - str.length;
  const padding: Array<string> = [];

  // Generate array with padding character
  for (let i=0; i<padLen; i++) {
    padding[i] = pad;
  }

  // Join array, concatenate with input and return
  return padding.join("") + str;
}

/**
 * Takes a number, converts it to binary and makes sure it is padded to a
 * length of 8 (i.e. a byte). If the input binary is longer than 8, it is
 * returned unchanged.
 *
 * @param num Number to be converted
 * @returns Binary number as a string of length 8
 */
export function toPaddedBinary(num: number): string {
  return padStart(num.toString(2), 8, "0");
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
