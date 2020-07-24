import { reverse, toPaddedBinary, toHex } from "../src/util";

describe("Utility function reverse()", () => {
  it("should reverse a string", () => {
    expect(reverse("hello")).toEqual("olleh");
  });

  it("should reverse a string with one character", () => {
    expect(reverse("a")).toEqual("a");
  });

  it("should reverse an empty string", () => {
    expect(reverse("")).toEqual("");
  });
});

describe("Utility function toPaddedBinary()", () => {
  it("should pad a number below 256 to a length of 8", () => {
    expect(toPaddedBinary(0)).toEqual("00000000");
    expect(toPaddedBinary(1)).toEqual("00000001");
    expect(toPaddedBinary(255)).toEqual("11111111");
  });

  it("should not pad numbers above 255", () => {
    expect(toPaddedBinary(256)).toEqual("100000000");
  });
});

describe("Utility function toHex()", () => {
  it("should pad numbers below 16 with a leading zero", () => {
    expect(toHex(0)).toEqual("0x00");
    expect(toHex(1)).toEqual("0x01");
    expect(toHex(10)).toEqual("0x0A");
    expect(toHex(15)).toEqual("0x0F");
  });

  it("should not pad numbers above 15", () => {
    expect(toHex(16)).toEqual("0x10");
    expect(toHex(256)).toEqual("0x100");
  });
});
