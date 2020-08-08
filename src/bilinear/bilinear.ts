import { linear } from '../linear'
import { IBilinearProps } from './interfaces'

export const bilinear = ({ x, y, x1, y1, x2, y2, q11, q12, q21, q22 }: IBilinearProps): number => {
  const interResult1 = linear({
    x,
    x1,
    y1: q11,
    x2,
    y2: q12,
  })
  const interResult2 = linear({
    x,
    x1,
    y1: q21,
    x2,
    y2: q22,
  })

  return linear({
    x: y,
    x1: y1,
    y1: interResult1,
    x2: y2,
    y2: interResult2,
  })
}
