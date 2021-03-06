/* eslint-disable no-undef */
'use strict'
import { expect, assert } from 'chai'
import { linear, bilinear, byTable, getKB, getCommonPointByBisectionMethod } from '../dist/index.js'
import { Map } from 'immutable'

describe('Main test', () => {
  it('1. linear', () => {
    const expectedVal = 1.5

    assert(linear({ x: 0.5, x1: 0, y1: 1, x2: 1, y2: 2 }) === expectedVal, 'Fuckup :(')
  })
  it('2. bilinear', () => {
    const expectedVal = 377.75
    const testedVal = bilinear({
      x: 3,
      y: 3.5,
      x1: 1,
      y1: 1,
      x2: 6,
      y2: 5,
      q11: 400,
      q12: 410,
      q21: 210,
      q22: 590,
    })

    expect(testedVal).to.equal(expectedVal)
  })

  it('3.1 byTable: Internal space', () => {
    const temperature = -21.0
    const percentage = 20.0
    const dataObj = [
      [0.0, -30, -20.0, -10.0, 0.0, 20.0, 40.0, 60.0, 80.0, 100.0],
      [0.0, 4.19, 4.19, 4.19, 4.19, 4.19, 4.19, 4.19, 4.19, 4.19],
      [25.0, 3.93, 3.93, 3.93, 3.95, 3.98, 4.0, 4.03, 4.05, 4.08],
      [37.0, 3.68, 3.68, 3.7, 3.72, 3.77, 3.82, 3.88, 3.94, 4.0],
      [45.0, 3.49, 3.49, 3.52, 3.56, 3.62, 3.69, 3.76, 3.82, 3.89],
    ]
    const expectedVal = 3.982
    const testedVal = byTable({
      x: temperature,
      y: percentage,
      tableAsDoubleArray: dataObj,
    })

    assert(testedVal === expectedVal, `Fuckup: testedVal is ${testedVal}`)
  })

  // TODO: External cases
  it('3.2 byTable: External { x1, y1 } point (Top Left space)', () => {
    const x = -5
    const y = -2
    const tableAsDoubleArray = [
      [0, 5, 10],
      [1, 1, 2],
      [2, 0, 1],
    ]
    const expectedVal = -12
    const testedVal = byTable({
      x,
      y,
      tableAsDoubleArray,
    })

    assert(testedVal === expectedVal, `Fuckup: testedVal is ${testedVal}`)
  })
  it('3.3 byTable: External { x1 } point (Center Left space)', () => {
    const x = -0.1
    const y = 1
    const tableAsDoubleArray = [
      [0, 1, 2, 3],
      [1, 2, 4, 8],
      [2, 4, 8, 16],
      [3, 8, 16, 32],
    ]
    const expectedVal = 0.020000000000000046
    const testedVal = byTable({
      x,
      y,
      tableAsDoubleArray,
    })

    assert(testedVal === expectedVal, `Fuckup: testedVal is ${testedVal}`)
  })
  it('3.4 byTable: External { x1, y2 } point (Bottom Left space)', () => {
    const x = 0.9
    const y = 4
    const tableAsDoubleArray = [
      [0, 1, 2, 3],
      [1, 2, 4, 8],
      [2, 4, 8, 16],
      [3, 8, 16, 32],
    ]
    const expectedVal = 0.020000000000000046
    const testedVal = byTable({
      x,
      y,
      tableAsDoubleArray,
    })

    assert(testedVal === expectedVal, `Fuckup: testedVal is ${testedVal}`)
  })

  // 3.5 byTable: External { y2 } point (Bottom Center space)
  // 3.6 byTable: External { x2, y2 } point (Bottom Right space)
  // 3.7 byTable: External { x2 } point (Center Right space)
  // 3.8 byTable: External { x2, y1 } point (Top Right space)

  it('4. getKB', () => {
    const expectedObj = Map({ k: 0.8, b: 0.19999999999999996 })
    const coeffs = getKB({
      x1: 1,
      y1: 1,
      x2: 6,
      y2: 5,
    })
    const testedObj = Map(coeffs)

    assert(testedObj.equals(expectedObj), `Fuckup :( coeffs is ${JSON.stringify(coeffs)}`)
  })

  it('5. getCommonPointByBisectionMethod', () => {
    const expectedObj = Map({
      error: false,
      x: 0.5002021789550781,
      y: 1.5002021789550781,
    })
    const { k: k1, b: b1 } = getKB({ x1: 0, y1: 1, x2: 1, y2: 2 })
    const { k: k2, b: b2 } = getKB({ x1: 0, y1: 2, x2: 1, y2: 1 })
    const fn1 = (x) => k1 * x + b1
    const fn2 = (x) => k2 * x + b2
    const result = getCommonPointByBisectionMethod({
      fn1,
      fn2,
    })
    const testedObj = Map(result)

    assert(testedObj.equals(expectedObj), `Fuckup :( result is ${JSON.stringify(result)}`)
  })
})
