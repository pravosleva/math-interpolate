/* eslint-disable */
import { bilinear } from '../bilinear'
import { IByInternalTableProps } from './interfaces'

const isTest = process.env.NODE_ENV === 'test'

/* TODO: External cases */
export const byTable = ({ x, y, tableAsDoubleArray }: IByInternalTableProps): number => {
  // 1. TODO: Sort & Check

  // 2. Find points:
  let x1: number
  let y1: number
  let x2: number
  let y2: number
  let coords11: [number | null, number | null] = [null, null]
  let coords12: [number | null, number | null] = [null, null]
  let coords21: [number | null, number | null] = [null, null]
  let coords22: [number | null, number | null] = [null, null]
  let q11: number
  let q12: number
  let q21: number
  let q22: number
  let isX1External: boolean = false
  let isX2External: boolean = false
  let isY1External: boolean = false
  let isY2External: boolean = false
  let result: number = 0

  // 2.1 Find nearest x1 & x2:
  const xRow = tableAsDoubleArray[0]

  if (x < xRow[1]) {
    x1 = xRow[1]
    x2 = xRow[2]
    isX1External = true
    coords11[0] = 1
    coords12[0] = 1
    coords21[0] = 2
    coords22[0] = 2
  } else if (x > xRow[xRow.length - 1]) {
    x1 = xRow[xRow.length - 2]
    x2 = xRow[xRow.length - 1]
    isX2External = true
    coords11[0] = xRow.length - 2
    coords12[0] = xRow.length - 2
    coords21[0] = xRow.length - 1
    coords22[0] = xRow.length - 1
  } else {
    xRow.forEach((val: number, i: number, a: number[]) => {
      if (x >= val && x <= a[i + 1]) {
        x1 = val
        coords11[0] = i
        coords12[0] = i
        x2 = a[i + 1]
        coords21[0] = i + 1
        coords22[0] = i + 1
      }
    })
  }

  // 2.2 Find nearest y1 & y2:
  const yRow = tableAsDoubleArray.map((row) => row[0]) // .splice(1, 1)

  if (y < yRow[1]) {
    y1 = yRow[1]
    y2 = yRow[2]
    isY1External = true
    coords11[1] = 1
    coords12[1] = 2
    coords21[1] = 1
    coords22[1] = 2
  } else if (y > yRow[yRow.length - 1]) {
    y1 = yRow[yRow.length - 2]
    y2 = yRow[yRow.length - 1]
    isY2External = true
    coords11[1] = yRow.length - 2
    coords12[1] = yRow.length - 1
    coords21[1] = yRow.length - 2
    coords22[1] = yRow.length - 1
  } else {
    yRow.forEach((val: number, i: number, a: number[]) => {
      if (y >= val && y <= a[i + 1]) {
        y1 = val
        y2 = a[i + 1]
        coords11[1] = i
        coords12[1] = i + 1
        coords21[1] = i
        coords22[1] = i + 1
      }
    })
  }

  if (
    [...coords11, ...coords12, ...coords21, ...coords22].some((val: any) => !Number.isInteger(val))
  ) {
    console.log(...coords11, ...coords12, ...coords21, ...coords22)
    throw new Error('Не удалось определить все координаты')
  }

  // 3. Bilinear:
  switch (true) {

    // 3.1 Bacsic: Internal Table
    case !isX1External && !isY1External && !isX2External && !isY2External:
      let i1
      let i2
      let j1
      let j2

      for (i2 = 1; tableAsDoubleArray[i2][0] < y; i2++);
      // eslint-disable-next-line prefer-const
      i1 = i2 - 1

      for (j2 = 1; tableAsDoubleArray[0][j2] < x; j2++);
      // eslint-disable-next-line prefer-const
      j1 = j2 - 1

      result = bilinear({
        x, y,
        x1: tableAsDoubleArray[0][j1],
        y1: tableAsDoubleArray[i1][0],
        x2: tableAsDoubleArray[0][j2],
        y2: tableAsDoubleArray[i2][0],
        q11: tableAsDoubleArray[i1][j1],
        q12: tableAsDoubleArray[i1][j2],
        q21: tableAsDoubleArray[i2][j1],
        q22: tableAsDoubleArray[i2][j2],
      })
      break

    // 3.2 Top Left space
    // @ts-ignore TS2678
    case isX1External && isY1External && !isX2External && !isY2External:
      q11 = bilinear({
        x, y,
        // @ts-ignore Variable 'x1' is used before being assigned.
        x1, y1, x2, y2,
        q11: tableAsDoubleArray[1][1],
        q12: tableAsDoubleArray[2][1],
        q21: tableAsDoubleArray[1][2],
        q22: tableAsDoubleArray[2][2],
      })
      q12 = tableAsDoubleArray[2][1]
      q21 = tableAsDoubleArray[1][2]
      q22 = tableAsDoubleArray[2][2]

      result = bilinear({
        x, y,
        // @ts-ignore
        x1, y1, x2, y2,
        q11, q12, q21, q22,
      })
      break

    // 3.3 Center Left space
    // @ts-ignore TS2678
    case isX1External && !isY1External && !isX2External && !isY2External:
      q11 = bilinear({
        // @ts-ignore
        x, y: tableAsDoubleArray[coords11[1]][0],
        // @ts-ignore Variable 'x1' is used before being assigned.
        x1, y1, x2, y2,
        // @ts-ignore Type 'null' cannot be used as an index type. TS 2538
        q11: tableAsDoubleArray[coords11[1]][coords11[0]], q12: tableAsDoubleArray[coords12[1]][coords21[0]],
        // @ts-ignore
        q21: tableAsDoubleArray[coords21[1]][coords21[0]], q22: tableAsDoubleArray[coords22[1]][coords22[0]],
      })
      q12 = bilinear({
        // @ts-ignore
        x, y: tableAsDoubleArray[coords12[1]][0],
        // @ts-ignore Variable 'x1' is used before being assigned.
        x1, y1, x2, y2,
        // @ts-ignore Type 'null' cannot be used as an index type. TS 2538
        q11: tableAsDoubleArray[coords11[1]][2], q12: tableAsDoubleArray[coords12[1]][2],
        // @ts-ignore
        q21: tableAsDoubleArray[coords21[1]][3], q22: tableAsDoubleArray[coords22[1]][3],
      })
      q21 = tableAsDoubleArray[1][2]
      q22 = tableAsDoubleArray[2][2]

      if (isTest) {
        console.group('3.2')
        // console.table({ isX1External, isY1External, isX2External, isY2External })
        console.table({ q11, q12, q21, q22 })
        console.table({ coords11, coords12, coords21, coords22 })
        console.groupEnd()
      }

      result = bilinear({
        x, y,
        // @ts-ignore
        x1, y1, x2, y2,
        q11, q12, q21, q22,
      })
      break

    // 3.4 Bootom Left space
    // @ts-ignore TS2678
    case isX1External && isY2External:
      break

    // 3.5 Bottom Center space
    case !isX2External && isY2External:
      break

    // 3.6 Bottom Right space
    // @ts-ignore TS2678
    case isX2External && isY2External:
      break

    // 3.7 Center Right space
    // @ts-ignore TS2678
    case isX2External && isY1External:
      break

    // 3.8 Top Right space
    // @ts-ignore TS2678
    case isX2External && isY1External:
      break

    // 3.9 Top Center space
    // @ts-ignore TS2678
    case isX1External && isY1External:
      break

    default:
      break
  }

  return result
}

export const byInternalTable = ({ x, y, tableAsDoubleArray }: IByInternalTableProps): number => {
  /*
    SHORT DESCRIPTION

    tableAsDoubleArray should be made as:
      head_y  | head_x  | head_x  | ..
      head_y  | value   | value   | ..
      head_y  | value   | value   | ..
  */
  try {
    let i1
    let i2
    let j1
    let j2

    for (i2 = 1; tableAsDoubleArray[i2][0] < y; i2++);
    // eslint-disable-next-line prefer-const
    i1 = i2 - 1

    for (j2 = 1; tableAsDoubleArray[0][j2] < x; j2++);
    // eslint-disable-next-line prefer-const
    j1 = j2 - 1

    return bilinear({
      x,
      y,
      x1: tableAsDoubleArray[0][j1],
      y1: tableAsDoubleArray[i1][0],
      x2: tableAsDoubleArray[0][j2],
      y2: tableAsDoubleArray[i2][0],
      q11: tableAsDoubleArray[i1][j1],
      q12: tableAsDoubleArray[i1][j2],
      q21: tableAsDoubleArray[i2][j1],
      q22: tableAsDoubleArray[i2][j2],
    })
  } catch (err) {
    return 0.0
  }
}
