import { formatCount } from './recipeView';

describe('recipeView formatCount function', () => {
  it('should return "?" if count is undefined', () => {
    expect(formatCount()).toBe('?');
	});
	it('should not return "?" if count is number', () => {
    expect(formatCount(5)).not.toBe("?");
    expect(formatCount("5.55")).not.toBe("?");
    expect(formatCount("-5.55")).not.toBe("?");
  });
	it('should return fraction string if number is not integer', () => {
    expect(formatCount(4.25)).toBe('4 1/4');
    expect(formatCount(0.5)).toBe('1/2');
    expect(formatCount(0.0001)).toBe('1/10000');
  });
});
