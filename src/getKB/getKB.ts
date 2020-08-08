import { IGetKBProps } from './interfaces';

export const getKB = ({ x1, y1, x2, y2 }: IGetKBProps) => {
  const k = (y2 - y1) / (x2 - x1);
  const b = y1 - k * x1;

  return { k, b };
};