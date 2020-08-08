import { bilinear } from '../bilinear'
import { IByInternalTableProps } from './interfaces'

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

    // if (!j2) {
    //   i1 -= 1; i2 = i1;
    //   j1 -= 1; j2 = j1;
    // }

    // console.log(tableAsDoubleArray[0][j1], tableAsDoubleArray[i1][0]);
    // console.log(tableAsDoubleArray[0][j2], tableAsDoubleArray[i2][0]);

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
