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

  it("should not accept an empty string as variable name", () => {
    expect(generateXBM.bind(null, "", [[true]])).toThrow();
  });

  it("should not accept an empty grid", () => {
    expect(generateXBM.bind(null, "test", [])).toThrow();
    expect(generateXBM.bind(null, "test", [[]])).toThrow();
  });

  it("should generate a 4x4 image", () => {
    const result = generateXBM("test", [
      [true, false, false, false],
      [false, true, false, false],
      [false, false, true, false],
      [false, false, false, true]
    ]);

    expect(result).toMatch("test_width 4");
    expect(result).toMatch("test_height 4");

    const matches = result.match(/\{(.+)\}/s);

    expect(matches).not.toBeNull();
    expect(matches!.length).toEqual(2);

    const data = matches![1].split(",").map((s) => s.trim()).filter((s) => s != "");

    expect(data.length).toEqual(4);
    expect(data).toEqual(["0x01", "0x02", "0x04", "0x08"]);
  });
});
