interface ILinearProps {
  x: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
interface IGetKBProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
interface IBilinearProps {
  x: number;
  y: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  q11: number;
  q12: number;
  q21: number;
  q22: number;
}
interface IByInternalTableProps {
  x: number;
  y: number;
  tableAsDoubleArray: number[][];
}
interface IGetCommonPointByBisectionMethod {
  fn1: (x: number) => number;
  fn2: (x: number) => number;
  xMin?: number; // Левый конец отрезка
  xMax?: number; // Правый конец отрезка
  eps?: number; // Требуемая точность
  iMax?: number; // Максимальное количество итераций
}

export default class Interpolate {
  static linear({ x, x1, y1, x2, y2 }: ILinearProps) {
    if (x1 === x2) {
      return (y1 + y2) / 2;
    }
    return ((x - x1) * (y2 - y1)) / (x2 - x1) + y1;
  }

  static getKB({ x1, y1, x2, y2 }: IGetKBProps) {
    const k = (y2 - y1) / (x2 - x1);
    const b = y1 - k * x1;

    return { k, b };
  }

  static bilinear({ x, y, x1, y1, x2, y2, q11, q12, q21, q22 }: IBilinearProps) {
    const interResult1 = Interpolate.linear({
      x,
      x1,
      y1: q11,
      x2,
      y2: q12,
    });
    const interResult2 = Interpolate.linear({
      x,
      x1,
      y1: q21,
      x2,
      y2: q22,
    });

    return Interpolate.linear({
      x: y,
      x1: y1,
      y1: interResult1,
      x2: y2,
      y2: interResult2,
    });
  }

  static byInternalTable({ x, y, tableAsDoubleArray }: IByInternalTableProps) {
    /*
      SHORT DESCRIPTION

      tableAsDoubleArray should be made as:
        head_y  | head_x  | head_x  | ..
        head_y  | value   | value   | ..
        head_y  | value   | value   | ..
    */
    try {
      let i1;
      let i2;
      let j1;
      let j2;

      for (i2 = 1; tableAsDoubleArray[i2][0] < y; i2++);
      i1 = i2 - 1;

      for (j2 = 1; tableAsDoubleArray[0][j2] < x; j2++);
      j1 = j2 - 1;

      // if (!j2) {
      //   i1 -= 1; i2 = i1;
      //   j1 -= 1; j2 = j1;
      // }

      // console.log(tableAsDoubleArray[0][j1], tableAsDoubleArray[i1][0]);
      // console.log(tableAsDoubleArray[0][j2], tableAsDoubleArray[i2][0]);

      return Interpolate.bilinear({
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
      });
    } catch (err) {
      return 0.0;
    }
  }

  static getCommonPointByBisectionMethod({
    fn1,
    fn2,
    xMin = -1000, // Левый конец отрезка
    xMax = 1000, // Правый конец отрезка
    eps = 0.001, // Требуемая точность
    iMax = 1000, // Максимальное количество итераций
  }: IGetCommonPointByBisectionMethod) {
    let a = xMin;
    let b = xMax;
    // const fn1 = x => (line1Coeffs.k * x) + line1Coeffs.b;
    const diffFn = (x: number) => fn1(x) - fn2(x);
    let counter = 0; // Счётчик итераций
    let middle = 0.0; // Переменная для вычисления середины отрезка

    if (Math.sign(diffFn(a)) * Math.sign(diffFn(b)) > 0) {
      return {
        error: true,
        descriptrion: 'diffFn(x) имеет одинаковый знак на границах отрезка',
      };
    }

    while (Math.abs(b - a) > eps) {
      middle = (a + b) / 2; // Середина между a и b

      // корень лежит в левой половине отрезка
      if (Math.sign(diffFn(a)) * Math.sign(diffFn(middle)) <= 0) {
        b = middle; // Сдвигаем правую границу отрезка в середину
      } else {
        a = middle; // Сдвигаем левую границу отрезка в середину
      }

      if (++counter === iMax) {
        return {
          error: true,
          descriptrion: 'Превышено максимально допустимое количество итераций',
        };
      }
    }

    // Успех, корень лежит где внутри отрезка [a, b], который имеет длину меньше eps
    return {
      error: false,
      x: (a + b) / 2,
      y: fn1((a + b) / 2),
    };
  }
}
