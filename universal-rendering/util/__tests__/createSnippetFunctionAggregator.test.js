import createSnippetFunctionAggregator from '../createSnippetFunctionAggregator';

describe('createSnippetFunctionAggregator', () => {
  it('should execute functions one by one and concat the results in order', () => {
    const func1 = (data) => {
      expect(data.one).toEqual(1);
      return 'fun1_' + data.one;
    };
    const func2 = (data) => {
      expect(data.two).toEqual(2);
      return 'fun2_' + data.two;
    };

    const combinedFunc = createSnippetFunctionAggregator(
      func1,
      func2,
    );

    const result = combinedFunc({ one: 1, two: 2 });
    expect(result).toEqual('fun1_1fun2_2');
  });
});
