import { ILinearProps } from './interfaces'

export const linear = ({ x, x1, y1, x2, y2 }: ILinearProps): number => {
  if (x1 === x2) {
    return (y1 + y2) / 2
  }
  return ((x - x1) * (y2 - y1)) / (x2 - x1) + y1
}
