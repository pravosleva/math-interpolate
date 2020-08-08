import { IGetCommonPointByBisectionMethod, IGetCommonPointByBisectionMethodResult } from './interfaces'

export const getCommonPointByBisectionMethod = ({
  fn1,
  fn2,
  xMin = -1000, // Левый конец отрезка
  xMax = 1000, // Правый конец отрезка
  eps = 0.001, // Требуемая точность
  iMax = 1000, // Максимальное количество итераций
}: IGetCommonPointByBisectionMethod): IGetCommonPointByBisectionMethodResult => {
  let a = xMin
  let b = xMax
  // const fn1 = x => (line1Coeffs.k * x) + line1Coeffs.b;
  const diffFn = (x: number) => fn1(x) - fn2(x)
  let counter = 0 // Счётчик итераций
  let middle = 0.0 // Переменная для вычисления середины отрезка

  if (Math.sign(diffFn(a)) * Math.sign(diffFn(b)) > 0) {
    return {
      error: true,
      descriptrion: 'diffFn(x) имеет одинаковый знак на границах отрезка',
    }
  }

  while (Math.abs(b - a) > eps) {
    middle = (a + b) / 2 // Середина между a и b

    // корень лежит в левой половине отрезка
    if (Math.sign(diffFn(a)) * Math.sign(diffFn(middle)) <= 0) {
      b = middle // Сдвигаем правую границу отрезка в середину
    } else {
      a = middle // Сдвигаем левую границу отрезка в середину
    }

    if (++counter === iMax) {
      return {
        error: true,
        descriptrion: 'Превышено максимально допустимое количество итераций',
      }
    }
  }

  // Успех, корень лежит где внутри отрезка [a, b], который имеет длину меньше eps
  return {
    error: false,
    x: (a + b) / 2,
    y: fn1((a + b) / 2),
  }
}
