import { toPgVectorLiteral } from './pgvector.util';

describe('toPgVectorLiteral', () => {
  it('formats a numeric vector as a pgvector literal', () => {
    expect(toPgVectorLiteral([0.1, -0.2, 3])).toBe('[0.1,-0.2,3]');
  });

  it('formats an empty vector', () => {
    expect(toPgVectorLiteral([])).toBe('[]');
  });
});
