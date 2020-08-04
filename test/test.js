'use strict';
const { expect, assert } = require('chai');
const Interpolate = require('../dist/index.js').default;
const Immutable = require('immutable');

const { linear, bilinear, byInternalTable, getKB, getCommonPointByBisectionMethod } = Interpolate;

describe('Test for static methods of Interpolate class.', () => {
  it('1. linear', () => {
    const expectedVal = 1.5;

    assert(linear({ x: 0.5, x1: 0, y1: 1, x2: 1, y2: 2 }) === expectedVal, 'Fuckup :(');
  });
  it('2. bilinear', () => {
    const expectedVal = 377.75;
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
    });

    // assert(testedVal === expectedVal, `Fuckup :( testedVal is ${testedVal}`);
    expect(testedVal).to.equal(expectedVal);
  });

  it('3.1. byInternalTable (internal point)', () => {
    const temperature = -21.0;
    const percentage = 20.0;
    const dataObj = [
      [0.0, -30, -20.0, -10.0, 0.0, 20.0, 40.0, 60.0, 80.0, 100.0],
      [0.0, 4.19, 4.19, 4.19, 4.19, 4.19, 4.19, 4.19, 4.19, 4.19],
      [25.0, 3.93, 3.93, 3.93, 3.95, 3.98, 4.0, 4.03, 4.05, 4.08],
      [37.0, 3.68, 3.68, 3.7, 3.72, 3.77, 3.82, 3.88, 3.94, 4.0],
      [45.0, 3.49, 3.49, 3.52, 3.56, 3.62, 3.69, 3.76, 3.82, 3.89],
    ];
    const expectedVal = 3.982;

    assert(
      byInternalTable({
        x: temperature,
        y: percentage,
        tableAsDoubleArray: dataObj,
      }) === expectedVal,
      'Fuckup :(',
    );
  });

  it('4. getKB', () => {
    const expectedObj = Immutable.Map({ k: 0.8, b: 0.19999999999999996 });
    const coeffs = getKB({
      x1: 1,
      y1: 1,
      x2: 6,
      y2: 5,
    });
    const testedObj = Immutable.Map(coeffs);

    assert(testedObj.equals(expectedObj), `Fuckup :( coeffs is ${JSON.stringify(coeffs)}`);
  });

  it('5. getCommonPointByBisectionMethod', () => {
    const expectedObj = Immutable.Map({
      error: false,
      x: 0.5002021789550781,
      y: 1.5002021789550781,
    });
    const { k: k1, b: b1 } = getKB({ x1: 0, y1: 1, x2: 1, y2: 2 });
    const { k: k2, b: b2 } = getKB({ x1: 0, y1: 2, x2: 1, y2: 1 });
    const fn1 = (x) => k1 * x + b1;
    const fn2 = (x) => k2 * x + b2;
    const result = getCommonPointByBisectionMethod({
      fn1,
      fn2,
    });
    const testedObj = Immutable.Map(result);

    assert(testedObj.equals(expectedObj), `Fuckup :( result is ${JSON.stringify(result)}`);
  });
});

/* SAMPLE
describe('getPlural function test', () => {
  it('should return Boys', () => {
    var result = index.getPlural('Boy');
    expect(result).to.equal('Boys');
  });
  it('should return Girls', () => {
    var result = index.getPlural('Girl');
    expect(result).to.equal('Girls');
  });
  it('should return Geese', () => {
    var result = index.getPlural('Goose');
    expect(result).to.equal('Geese');
  });
  it('should return Toys', () => {
    var result = index.getPlural('Toy');
    expect(result).to.equal('Toys');
  });
  it('should return Men', () => {
    var result = index.getPlural('Man');
    expect(result).to.equal('Men');
  });
});
*/
