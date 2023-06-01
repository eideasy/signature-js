import { calculateChildPosition } from '../windowOpen';

const dataSets = [
  {
    set: 0,
    parent: {
      width: 1200,
      height: 700,
      left: -7,
      top: -5,
    },
    child: {
      width: 800,
      height: 600,
    },
    result: {
      left: 193,
      top: 45,
    },
  },
  {
    set: 1,
    parent: {
      width: 600,
      height: 400,
      left: -7,
      top: -5,
    },
    child: {
      width: 800,
      height: 600,
    },
    result: {
      left: -107,
      top: -105,
    },
  },
];

describe.each(dataSets)('windowOpen should center the window for:', (dataSet) => {
  it(`dataset ${dataSet.set}`, () => {
    expect(calculateChildPosition({
      parent: dataSet.parent,
      child: dataSet.child,
    })).toEqual(dataSet.result);
  });
});
