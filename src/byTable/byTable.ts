/* eslint-disable */
import { bilinear } from '../bilinear'
import { IByTableProps, TCode } from './interfaces'

const isTest = process.env.NODE_ENV === 'test'

const getCaseData = (isX1External: boolean, isY1External: boolean, isX2External: boolean, isY2External: boolean): TCode => {
  switch (true) {
    case (!isX1External && !isY1External && !isX2External && !isY2External): return { name: 'internal', code: 3.1 }
    case (isX1External && isY1External && !isX2External && !isY2External): return { name: 'top-left', code: 3.2 }
    case (isX1External && !isY1External && !isX2External && !isY2External): return { name: 'center-left', code: 3.3 }
    case (isX1External && isY2External): return { name: 'bottom-left', code: 3.4 }
    case (!isX2External && isY2External): return { name: 'bottom-center', code: 3.5 }
    case (isX2External && isY2External): return { name: 'bottom-right', code: 3.6 }
    case (isX2External && isY1External): return { name: 'center-right', code: 3.7 }
    case (isX2External && isY1External): return { name: 'top-right', code: 3.8 }
    case (isX1External && isY1External): return { name: 'top-center', code: 3.9 }
    default: return { name: 'undef', code: 0 }
  }
}

/* TODO: External cases */
export const byTable = ({ x, y, tableAsDoubleArray }: IByTableProps): number => {
  // 1. TODO: Sort & Check

  // 2. Find points:
  let x1: number
  let y1: number
  let x2: number
  let y2: number
  let quasiCoords11: [number | null, number | null] = [null, null]
  let quasiCoords12: [number | null, number | null] = [null, null]
  let quasiCoords21: [number | null, number | null] = [null, null]
  let quasiCoords22: [number | null, number | null] = [null, null]
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
    quasiCoords11[0] = 1
    quasiCoords12[0] = 1
    quasiCoords21[0] = 2
    quasiCoords22[0] = 2
  } else if (x > xRow[xRow.length - 1]) {
    x1 = xRow[xRow.length - 2]
    x2 = xRow[xRow.length - 1]
    isX2External = true
    quasiCoords11[0] = xRow.length - 2
    quasiCoords12[0] = xRow.length - 2
    quasiCoords21[0] = xRow.length - 1
    quasiCoords22[0] = xRow.length - 1
  } else {
    xRow.forEach((val: number, i: number, a: number[]) => {
      if (x >= val && x <= a[i + 1]) {
        x1 = val
        quasiCoords11[0] = i
        quasiCoords12[0] = i
        x2 = a[i + 1]
        quasiCoords21[0] = i + 1
        quasiCoords22[0] = i + 1
      }
    })
  }

  // 2.2 Find nearest y1 & y2:
  const yRow = tableAsDoubleArray.map((row: number[]) => row[0]) // .splice(1, 1)

  if (y < yRow[1]) {
    y1 = yRow[1]
    y2 = yRow[2]
    isY1External = true
    quasiCoords11[1] = 1
    quasiCoords12[1] = 2
    quasiCoords21[1] = 1
    quasiCoords22[1] = 2
  } else if (y > yRow[yRow.length - 1]) {
    y1 = yRow[yRow.length - 2]
    y2 = yRow[yRow.length - 1]
    isY2External = true
    quasiCoords11[1] = yRow.length - 2
    quasiCoords12[1] = yRow.length - 1
    quasiCoords21[1] = yRow.length - 2
    quasiCoords22[1] = yRow.length - 1
  } else {
    yRow.forEach((val: number, i: number, a: number[]) => {
      if (y >= val && y <= a[i + 1]) {
        y1 = val
        y2 = a[i + 1]
        quasiCoords11[1] = i
        quasiCoords12[1] = i + 1
        quasiCoords21[1] = i
        quasiCoords22[1] = i + 1
      }
    })
  }

  if (
    [...quasiCoords11, ...quasiCoords12, ...quasiCoords21, ...quasiCoords22].some((val: any) => !Number.isInteger(val))
  ) {
    console.log(...quasiCoords11, ...quasiCoords12, ...quasiCoords21, ...quasiCoords22)
    throw new Error('Не удалось определить все координаты (области относительно таблицы)')
  }

  const { code: caseCode, name: caseName } = getCaseData(isX1External, isY1External, isX2External, isY2External)

  // 3. Bilinear:
  switch (caseName) {

    // 3.1
    case 'internal':
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

    // 3.2
    case 'top-left':
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

    // 3.3
    case 'center-left':
      q11 = bilinear({
        // @ts-ignore
        x, y: tableAsDoubleArray[quasiCoords11[1]][0],
        // @ts-ignore Variable 'x1' is used before being assigned.
        x1, y1, x2, y2,
        // @ts-ignore Type 'null' cannot be used as an index type. TS 2538
        q11: tableAsDoubleArray[quasiCoords11[1]][quasiCoords11[0]], q12: tableAsDoubleArray[quasiCoords12[1]][quasiCoords12[0]],
        // @ts-ignore
        q21: tableAsDoubleArray[quasiCoords21[1]][quasiCoords21[0]], q22: tableAsDoubleArray[quasiCoords22[1]][quasiCoords22[0]],
      })
      q12 = bilinear({
        // @ts-ignore
        x, y: tableAsDoubleArray[quasiCoords12[1]][0],
        // @ts-ignore Variable 'x1' is used before being assigned.
        x1, y1, x2, y2,
        // @ts-ignore Type 'null' cannot be used as an index type. TS 2538
        q11: tableAsDoubleArray[quasiCoords11[1]][quasiCoords11[0]], q12: tableAsDoubleArray[quasiCoords12[1]][quasiCoords12[0]],
        // @ts-ignore
        q21: tableAsDoubleArray[quasiCoords21[1]][quasiCoords21[0]], q22: tableAsDoubleArray[quasiCoords22[1]][quasiCoords22[0]],
      })
      q21 = tableAsDoubleArray[1][1]
      q22 = tableAsDoubleArray[2][1]

      result = bilinear({
        x, y,
        // @ts-ignore
        x1, y1, x2, y2,
        q11, q12, q21, q22,
      })
      break

    // 3.4
    case 'bottom-left':
      break

    // 3.5
    case 'bottom-center':
      break

    // 3.6
    case 'bottom-right':
      break

    // 3.7
    case 'center-right':
      break

    // 3.8
    case 'top-right':
      break

    // 3.9
    case 'top-center':
      break

    default:
      break
  }

  if (isTest) {
    console.group(`${caseCode}: ${caseName}`)
    // console.table({ isX1External, isY1External, isX2External, isY2External })
    // @ts-ignore
    console.table({ q11, q12, q21, q22 })
    tableAsDoubleArray.forEach((row: number[]) => {
      console.log(row)
    })
    console.table({ quasiCoords11, quasiCoords12, quasiCoords21, quasiCoords22 })
    console.groupEnd()
  }

  return result
}