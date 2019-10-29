import getValueFromNestedObject from '../getValueFromNestedObject';

const mockData = {
  prop1: {
    prop11: {
      prop111: {
        prop1111: 'level4',
      },
      prop112: 'level3',
    },
    prop12: 'level2',
  },
  prop2: 'level1',
};

describe('getValueFromNestedObject', () => {
  it('should return `level4` for mockData.prop1.prop11.prop111.prop1111', () => {
    const result = getValueFromNestedObject(mockData, ['prop1', 'prop11', 'prop111', 'prop1111']);
    expect(result).toEqual('level4');
  });

  it('should return `level3` for mockData.prop1.prop11.prop112', () => {
    const result = getValueFromNestedObject(mockData, ['prop1', 'prop11', 'prop112']);
    expect(result).toEqual('level3');
  });

  it('should return `null` for mockData.prop1.prop114', () => {
    const result = getValueFromNestedObject(mockData, ['prop1', 'prop114']);
    expect(result).toEqual(null);
  });

  it('should return `defaultValue` for mockData.prop1.prop114', () => {
    const result = getValueFromNestedObject(mockData, ['prop1', 'prop114'], 'defaultValue');
    expect(result).toEqual('defaultValue');
  });
});