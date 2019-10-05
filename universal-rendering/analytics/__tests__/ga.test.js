import ga from '../ga';

describe('ga', () => {
  it('should not render ga code', () => {
    const gaSnippet = ga();
    expect(gaSnippet).toEqual('');
  });

  it('should render ga code with expId', () => {
    const gaSnippet = ga('tracking_id', 'container_id', 'exp_id');
    expect(gaSnippet).toContain('exp_id');
  });

  it('should render ga code without expId if param not passed through', () => {
    const gaSnippet = ga('tracking_id', 'container_id');
    expect(gaSnippet.includes('ga(\'set\', \'exp\',')).toBeFalsy();
  });
});
