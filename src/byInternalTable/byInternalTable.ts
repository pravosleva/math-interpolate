/* eslint-disable */
import { bilinear } from '../bilinear'
import { IByInternalTableProps } from './interfaces'

/* TODO: External cases
export const _byInternalTable2 = ({ x, y, tableAsDoubleArray }: IByInternalTableProps): number => {
  // 0. Sort?

  // 1. Find points:
  let x1: number
  // let iX1
  let y1: number
  // let iY1
  let x2: number
  let y2: number
  let q11: number
  let q12: number
  let q21: number
  let q22: number
  let isX1External: boolean = false
  let isX2External: boolean = false
  let isY1External: boolean = false
  let isY2External: boolean = false

  // 1.1 Find nearest x1 & x2:
  tableAsDoubleArray.forEach((row, iR, t) => {
    if (iR === 0) {
      if (x <= row[0]) {
        x1 = x
        x2 = row[0]
        isX1External = true
        // q11 = t[0][]
      } else if (x >= row[row.length - 1]) {
        x1 = row[row.length - 1]
        x2 = x
        isX2External = true
      } else {
        row.forEach((val: number, i: number, a: number[]) => {
          if (x >= val && x <= a[i + 1]) {
            x1 = val
            x2 = a[i + 1]
          }
        })
      }
    }
  })

  // 1.2 Find nearest y1 & y2:
  const yRow = tableAsDoubleArray.map((row) => row[0])

  if (y <= yRow[0]) {
    y1 = y
    y2 = yRow[0]
    isY1External = true
  } else if (y >= yRow[yRow.length - 1]) {
    y1 = yRow[yRow.length - 1]
    y2 = y
    isY2External = true
  } else {
    yRow.forEach((val: number, i: number, a: number[]) => {
      if (y > val && y < a[i + 1]) {
        y1 = val
        y2 = a[i + 1]
      }
    })
  }

  // 2. Find qs:
  switch (true) {
    // Top Left space
    // @ts-ignore TS2678
    case isX1External && isY1External:
      q22 = tableAsDoubleArray[1][1]
      q21 = tableAsDoubleArray[0][1]
      q12 = tableAsDoubleArray[1][0]
      // q11 = ?
      break
    // Bootom Left space
    // @ts-ignore TS2678
    case isX1External && isY2External:
      q21 = tableAsDoubleArray[tableAsDoubleArray.length - 2][1]
      q22 = tableAsDoubleArray[tableAsDoubleArray.length - 1][1]
      q11 = tableAsDoubleArray[tableAsDoubleArray.length - 2][0]
      // q12 = ?
      break
    // Left Center space
    // @ts-ignore TS2678
    case isX1External && !isY1External:
      break
    // Left Bottom space
    // @ts-ignore TS2678
    case isX1External && isY2External:
      break
    // Bottom space
    case !isX2External && isY2External:
      break
    // Bottom Right space
    // @ts-ignore TS2678
    case isX2External && isY2External:
      break
    // Right Center space
    // @ts-ignore TS2678
    case isX2External && isY1External:
      break
    // Top Right space
    // @ts-ignore TS2678
    case isX2External && isY1External:
      break
    // Top space
    // @ts-ignore TS2678
    case isX1External && isY1External:
      break
    default:
      break
  }

  return 0
}
*/

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
