import { generateXBM } from "../src";

describe("Function generateXBM()", () => {
  it("should generate a 1x1 XBM file from a 1x1 input matrix, padding output to mulitple of 8", () => {
    const result = generateXBM("test", [[true]]);

    expect(result).toMatch(/test_width 1/);
    expect(result).toMatch(/test_height 1/);
    expect(result).toMatch(/\{.*0x01.*\}/s);
  });

  it("should generate a 8x1 XBM file from a 8x1 input matrix", () => {
    const result = generateXBM("test", [
      [true], [true], [true], [true],
      [true], [true], [true], [true]
    ]);

    expect(result).toMatch(/test_width 8/);
    expect(result).toMatch(/test_height 1/);
    expect(result).toMatch(/\{.*0xFF.*\}/s);
  });

  it("should generate a 8x1 XBM file from a 8x1 input matrix will all pixels zero", () => {
    const result = generateXBM("test", [
      [false], [false], [false], [false],
      [false], [false], [false], [false]
    ]);

    expect(result).toMatch(/test_width 8/);
    expect(result).toMatch(/test_height 1/);
    expect(result).toMatch(/\{.*0x00.*\}/s);
  });
});
