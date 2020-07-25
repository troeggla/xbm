import { toPaddedBinary, toHex, reverse } from "./util";

/**
 * Initialises a matrix with the given dimensions and returns it. Each element
 * in the matrix is initialised to `false`.
 *
 * @param dimensions Dimensions of the matrix
 * @returns A matrix of the given dimension initialised to `false`
 */
function initGrid(dimensions: [number, number]): boolean[][] {
  const [width, height] = dimensions;
  const matrix: boolean[][] = [];

  // Initialise all the columns
  for (let x = 0; x < width; x++) {
    matrix[x] = [];

    // Initialise every cell in the row to false
    for (let y = 0; y < height; y++) {
      matrix[x][y] = false;
    }
  }

  return matrix;
}

/**
 * Takes a maktrix of boolean values and flattens it, i.e. returns a
 * one-dimensional array with all the rows concatenated. Moreover, if the
 * length of the rows is not evenly divisible by 8, they are padded to a length
 * which is divisible by 8 by appending the required number of `false` values.
 *
 * @param grid Grid to be flattened
 * @returns Flattened grid
 */
function flatten(grid: boolean[][]): Array<boolean> {
  const flattenedGrid: Array<boolean> = [];
  const remainder = grid.length % 8;

  // Iterate all the rows
  for (let y = 0; y < grid[0].length; y++) {
    // Collect each cell into the output array
    for (let x = 0; x < grid.length; x++) {
      flattenedGrid.push(grid[x][y]);
    }

    // Pad with `false` until the length is divisible by 8
    if (remainder > 0) {
      for (let i = 0; i < 8 - remainder; i++) {
        flattenedGrid.push(false);
      }
    }
  }

  return flattenedGrid;
}

/**
 * Takes a list of numbers, converts them to hexadecimal notation and arranges
 * them into groups of 12, where each value is delimited by a comma and each
 * group is separated by a line break.
 *
 * @param bytes Array of numbers to be formatted
 * @returns A string of formatted hex values
 */
function formatBytes(bytes: Array<number>): string {
  let formattedBytes = "";

  // Iterate over the array with a step size of 12
  for (let i = 0; i < bytes.length; i += 12) {
    // Get group of 12 from array
    const slice = bytes.slice(i, i + 12);
    // Convert to hex, join with comma, end with newline and append to string
    formattedBytes += "  " + slice.map(toHex).join(", ") + ",\n";
  }

  return formattedBytes;
}

/**
 * Takes XBM data as a string and tries to extract the width of the image by
 * looking for the corresponding `#define` statement and returns it. If no such
 * statement can be found, 0 is returned.
 *
 * @param data XBM formatted data as a string
 * @returns The width specified in the file, 0 on error
 */
function getWidth(data: string): number {
  // Search for the string `_width` following by a number
  const regex = /.*_width ([0-9]+).*/;
  const match = regex.exec(data);

  // Parse the match as int or return 0
  return parseInt(match?.[1] || "0", 10);
}

/**
 * Takes XBM data as a string and tries to extract the height of the image by
 * looking for the corresponding `#define` statement and returns it. If no such
 * statement can be found, 0 is returned.
 *
 * @param data XBM formatted data as a string
 * @returns The height specified in the file, 0 on error
 */
function getHeight(data: string): number {
  // Search for the string `_height` following by a number
  const regex = /.*_height ([0-9]+).*/;
  const match = regex.exec(data);

  // Parse the match as int or return 0
  return parseInt(match?.[1] || "0", 10);
}

/**
 * Takes XBM data as a string and tries to extract the data portion of the
 * image by looking for a block of hex values delimited by curly braces. If
 * found, the block is split using the comma character as delimiter and the hex
 * values are converted to binary strings which are padded to the length of a
 * byte. This is then converted to an array of characters and returned. If no
 * block matching the conditions if found, `undefined` is returned.
 *
 * @param data XBM formatted data as a string
 * @returns An array containing the data portion of the input as binary strings
 */
function getPixels(data: string): Array<string> | undefined {
  // Try and match block delimited by curly braces
  const regex = /.*\{(.+)\}.*/s;
  const match = regex.exec(data);

  const bytes = match?.[1]?.trim();

  // If there's no match return undefined
  if (!bytes) {
    return undefined;
  } else {
    // Split string with comma
    return bytes.split(",").map((x) => {
      return x.trim();
    }).filter((x) => {
      // Filter hex values of the required length
      return x.length === 4;
    }).map((x) => {
      // Parse as hex, convert to binary and convert endianness, finally
      // separate into an array of single characters
      return reverse(toPaddedBinary(parseInt(x, 16)));
    }).join("").split("");
  }
}

/**
 * Takes a string of XBM-formatted data, parses it and returns a matrix of the
 * given width and height containing the data from the XBM as boolean values.
 * If the contents of the string cannot be parsed, an error is thrown.
 *
 * @param data String containing XBM-formatted data
 * @returns A matrix of boolean values or undefined
 */
export function readXBM(data: string): boolean[][] | undefined {
  // Extract width and height from the data
  const height = getHeight(data);
  const width = getWidth(data);

  // Make sure neither width nor height are 0
  if (width == 0 || height == 0) {
    throw new Error("Could not extract valid dimensions from input");
  }

  // Get padded width as mulitple of 8
  const fileWidth = Math.ceil(width / 8) * 8;

  // Extract pixel data from string
  const bitstr = getPixels(data);
  // Initialise grid with extracted widht and height
  const grid = initGrid([width, height]);

  // Throw error if data could not be parsed
  if (!bitstr) {
    throw new Error("Could parse XBM data field");
  }

  try {
    // Iterate over bit string
    for (let i = 0; i < bitstr.length; i++) {
      // Current coordinates
      const y = Math.floor(i / fileWidth);
      const x = i % fileWidth;

      // Skip to next if the x coordinate is bigger then the image width
      if (x >= width) {
        continue;
      }

      // Initialse the pixel in the output grid to true or false
      grid[x][y] = (bitstr[i] === "1") ? true : false;
    }
  } catch (e) {
    // Returns undefined if there was an error
    console.error(e);
    return undefined;
  }

  return grid;
}

/**
 * Takes a grid of boolean values and converts it into XBM-formatted data which
 * is returned as a string.
 *
 * @param name Name of the variable to be used in the output file
 * @param grid The grid from which the XBM data shall be generated
 * @returns XBM-formatted data
 */
export function generateXBM(name: string, grid: boolean[][]): string {
  if (name.length === 0) {
    throw new Error("Name cannot be empty");
  }

  // Get desired width and height of the image
  const width = grid.length;
  // Make sure width is not 0
  if (width == 0) {
    throw new Error("Grid cannot be of width 0");
  }

  const height = grid[0].length;
  // Make sure height is not 0
  if (height == 0) {
    throw new Error("Grid cannot be of height 0");
  }

  // Flatten grid and initialise output array
  const flatGrid = flatten(grid);
  const byteArray: Array<number> = [];

  // Iterate over flattened grid with step size 8
  for (let i = 0; i < flatGrid.length; i += 8) {
    // Push data from grid as a bitmask
    byteArray.push(
      (+flatGrid[i + 0] << 0) |
      (+flatGrid[i + 1] << 1) |
      (+flatGrid[i + 2] << 2) |
      (+flatGrid[i + 3] << 3) |
      (+flatGrid[i + 4] << 4) |
      (+flatGrid[i + 5] << 5) |
      (+flatGrid[i + 6] << 6) |
      (+flatGrid[i + 7] << 7)
    );
  }

  // Wrap data in required C code, add define statements for width and height
  // and convert byte array to hex numbers in groups of 12
  return (
    "#include <Arduino.h>\n" +
    "\n" +
    `#define ${name}_width ${width}\n` +
    `#define ${name}_height ${height}\n` +
    "\n" +
    `const PROGMEM uint8_t ${name}_bits[] = {\n` +
    formatBytes(byteArray) +
    "};\n"
  );
}
