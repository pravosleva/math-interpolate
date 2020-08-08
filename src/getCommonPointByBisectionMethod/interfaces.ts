export interface IGetCommonPointByBisectionMethod {
  fn1: (x: number) => number
  fn2: (x: number) => number
  xMin?: number // Левый конец отрезка
  xMax?: number // Правый конец отрезка
  eps?: number // Требуемая точность
  iMax?: number // Максимальное количество итераций
}

export interface IGetCommonPointByBisectionMethodResult {
  error: boolean
  descriptrion?: string
  x?: number
  y?: number
}
