function padStart(str: string, targetLen: number, pad = "0") {
  if (str.length >= targetLen) {
    return str;
  }

  const padLen = targetLen - str.length;
  const padding: Array<string> = [];

  for (let i=0; i<padLen; i++) {
    padding[i] = pad;
  }

  return padding.join("") + str;
}

export function toPaddedBinary(num: number) {
  return padStart(num.toString(2), 8, "0");
}

export function reverse(str: string) {
  return str.split("").reverse().join("");
}

export function toHex(byte: number) {
  const hexStr = byte.toString(16).toUpperCase();
  return (hexStr.length === 1) ? `0x0${hexStr}` : `0x${hexStr}`;
}
