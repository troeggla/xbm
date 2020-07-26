import { generateXBM, readXBM } from "../src";

describe("Function generateXBM()", () => {
  it("should generate a 1x1 XBM file from a 1x1 input matrix, padding output to mulitple of 8", () => {
    const result = generateXBM("test", [[true]]);

    expect(result).toMatch(/test_width 1/);
    expect(result).toMatch(/test_height 1/);
    expect(result).toMatch(/\{.*0x01.*\}/s);
  });

  it("should generate a 1x1 XBM file without Arduino header", () => {
    const result = generateXBM("test", [[true]]);

    expect(result).not.toMatch("Arduino.h");
    expect(result).not.toMatch("const PROGMEM uint8_t");
  });

  it("should generate a 1x1 XBM file with Arduino header", () => {
    const result = generateXBM("test", [[true]], true);

    expect(result).toMatch("Arduino.h");
    expect(result).toMatch("const PROGMEM uint8_t");
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

  it("should not accept a grid with a width of 0", () => {
    expect(generateXBM.bind(null, "test", [])).toThrow(
      "Grid cannot be of width 0"
    );
  });

  it("should not accept a grid with a height of 0", () => {
    expect(generateXBM.bind(null, "test", [[]])).toThrow(
      "Grid cannot be of height 0"
    );
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

  it("should generate a 4x4 image with Arduino headers", () => {
    const result = generateXBM("test", [
      [true, false, false, false],
      [false, true, false, false],
      [false, false, true, false],
      [false, false, false, true]
    ], true);

    expect(result).toMatch("test_width 4");
    expect(result).toMatch("test_height 4");
    expect(result).toMatch("Arduino.h");
    expect(result).toMatch("const PROGMEM uint8_t");

    const matches = result.match(/\{(.+)\}/s);

    expect(matches).not.toBeNull();
    expect(matches!.length).toEqual(2);

    const data = matches![1].split(",").map((s) => s.trim()).filter((s) => s != "");

    expect(data.length).toEqual(4);
    expect(data).toEqual(["0x01", "0x02", "0x04", "0x08"]);
  });
});

describe("Function readXBM()", () => {
  it("should parse basic XBM-formatted data as a 1x1 grid with the pixel set to 1", () => {
    const data = (
      "#include <Arduino.h>\n" +
      "\n" +
      "#define test_width 1\n" +
      "#define test_height 1\n" +
      "\n" +
      "const PROGMEM uint8_t test_bits[] = {\n" +
      "  0x01" +
      "};\n"
    );

    expect(readXBM(data)).toEqual([[true]]);
  });

  it("should parse basic XBM-formatted data as a 1x1 grid with the pixel set to 0", () => {
    const data = (
      "#include <Arduino.h>\n" +
      "\n" +
      "#define test_width 1\n" +
      "#define test_height 1\n" +
      "\n" +
      "const PROGMEM uint8_t test_bits[] = {\n" +
      "  0x00" +
      "};\n"
    );

    expect(readXBM(data)).toEqual([[false]]);
  });

  it("should not parse XBM-formatted data without a given width", () => {
    const data = (
      "#include <Arduino.h>\n" +
      "\n" +
      "#define test_height 1\n" +
      "\n" +
      "const PROGMEM uint8_t test_bits[] = {\n" +
      "  0x00" +
      "};\n"
    );

    expect(readXBM.bind(null, data)).toThrow(
      "Could not extract valid dimensions from input"
    );
  });

  it("should not parse XBM-formatted data without a given height", () => {
    const data = (
      "#include <Arduino.h>\n" +
      "\n" +
      "#define test_width 1\n" +
      "\n" +
      "const PROGMEM uint8_t test_bits[] = {\n" +
      "  0x00" +
      "};\n"
    );

    expect(readXBM.bind(null, data)).toThrow(
      "Could not extract valid dimensions from input"
    );
  });

  it("should not parse XBM-formatted data with a width of 0", () => {
    const data = (
      "#include <Arduino.h>\n" +
      "\n" +
      "#define test_height 1\n" +
      "#define test_width 0\n" +
      "\n" +
      "const PROGMEM uint8_t test_bits[] = {\n" +
      "  0x00" +
      "};\n"
    );

    expect(readXBM.bind(null, data)).toThrow(
      "Could not extract valid dimensions from input"
    );
  });

  it("should not parse XBM-formatted data with a height of 0", () => {
    const data = (
      "#include <Arduino.h>\n" +
      "\n" +
      "#define test_height 0\n" +
      "#define test_width 1\n" +
      "\n" +
      "const PROGMEM uint8_t test_bits[] = {\n" +
      "  0x00" +
      "};\n"
    );

    expect(readXBM.bind(null, data)).toThrow(
      "Could not extract valid dimensions from input"
    );
  });

  it("should not parse XBM-formatted string without data portion", () => {
    const data = (
      "#include <Arduino.h>\n" +
      "\n" +
      "#define test_height 1\n" +
      "#define test_width 1\n"
    );

    expect(readXBM.bind(null, data)).toThrow(
      "Could parse XBM data field"
    );
  });

  it("should not parse XBM-formatted string empty data portion", () => {
    const data = (
      "#include <Arduino.h>\n" +
      "\n" +
      "#define test_height 1\n" +
      "#define test_width 1\n" +
      "const PROGMEM uint8_t test_bits[] = {\n" +
      "};\n"
    );

    expect(readXBM.bind(null, data)).toThrow(
      "Could parse XBM data field"
    );
  });
});

describe("Round-trip test", () => {
  it("should convert a matrix to XBM and back again", () => {
    const grid = [
      [true, false, false, true],
      [false, true, false, false],
      [true, false, true, false],
      [false, false, true, true]
    ];

    const generatedXBM = generateXBM("test", grid);
    expect(readXBM(generatedXBM)).toEqual(grid);
  });

  it("should convert XBM-format data to a grid and back again", () => {
    const input = (
      "#define test_width 4\n" +
      "#define test_height 4\n" +
      "\n" +
      "static char test_bits[] = {\n" +
      "  0x01, 0x02, 0x04, 0x08,\n" +
      "};\n"
    );

    const grid = readXBM(input);
    expect(generateXBM("test", grid)).toEqual(input);
  });

  it("should convert XBM-format data to a grid and back again with Arduino headers", () => {
    const input = (
      "#include <Arduino.h>\n" +
      "\n" +
      "#define test_width 4\n" +
      "#define test_height 4\n" +
      "\n" +
      "const PROGMEM uint8_t test_bits[] = {\n" +
      "  0x01, 0x02, 0x04, 0x08,\n" +
      "};\n"
    );

    const grid = readXBM(input);
    expect(generateXBM("test", grid, true)).toEqual(input);
  });
});
