import { toPaddedBinary, toHex, reverse } from "./util";

function initGrid(dimensions: [number, number]): boolean[][] {
  const [width, height] = dimensions;
  const matrix: boolean[][] = [];

  for (let x = 0; x < width; x++) {
    matrix[x] = [];

    for (let y = 0; y < height; y++) {
      matrix[x][y] = false;
    }
  }

  return matrix;
}

function flatten(grid: boolean[][]): Array<boolean> {
  const flattenedGrid: Array<boolean> = [];
  const remainder = grid.length % 8;

  for (let y = 0; y < grid[0].length; y++) {
    for (let x = 0; x < grid.length; x++) {
      flattenedGrid.push(grid[x][y]);
    }

    if (remainder > 0) {
      for (let i = 0; i < 8 - remainder; i++) {
        flattenedGrid.push(false);
      }
    }
  }

  return flattenedGrid;
}

function formatBytes(bytes: Array<number>): string {
  let formattedBytes = "";

  for (let i = 0; i < bytes.length; i += 12) {
    const slice = bytes.slice(i, i + 12);
    formattedBytes += "  " + slice.map(toHex).join(", ") + ",\n";
  }

  return formattedBytes;
}

function getWidth(data: string) {
  const regex = /.*_width ([0-9]+).*/;
  const match = regex.exec(data);

  return parseInt(match?.[1] || "0", 10);
}

function getHeight(data: string) {
  const regex = /.*_height ([0-9]+).*/;
  const match = regex.exec(data);

  return parseInt(match?.[1] || "0", 10);
}

function getPixels(data: string) {
  const regex = /.*\{(.+)\}.*/s;
  const match = regex.exec(data);

  const bytes = match?.[1]?.trim();

  if (!bytes) {
    return undefined;
  } else {
    return bytes.split(",").map((x) => {
      return x.trim();
    }).filter((x) => {
      return x.length === 4;
    }).map((x) => {
      return reverse(toPaddedBinary(parseInt(x, 16)));
    }).join("").split("");
  }
}

export function readXBM(data: string) {
  const height = getHeight(data);
  const width = getWidth(data);
  const fileWidth = Math.ceil(width / 8) * 8;

  const bitstr = getPixels(data);
  const grid = initGrid([width, height]);

  if (!bitstr) {
    return undefined;
  }

  try {
    for (let i = 0; i < bitstr.length; i++) {
      const y = Math.floor(i / fileWidth);
      const x = i % fileWidth;

      if (x >= width) {
        continue;
      }

      grid[x][y] = (bitstr[i] === "1") ? true : false;
    }
  } catch (e) {
    console.error(e);
    return undefined;
  }

  return grid;
}

export function generateXBM(name: string, grid: boolean[][]): string {
  const width = grid.length;
  const height = grid[0].length;

  const flatGrid = flatten(grid);
  const byteArray: Array<number> = [];

  for (let i = 0; i < flatGrid.length; i += 8) {
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
