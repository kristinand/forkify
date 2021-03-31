import { getCountNmberFromString } from './Recipe';

describe('Recipe getCountNmberFromString function', () => {
  it('should convert string to fraction and divide', () => {
    expect(getCountNmberFromString('1/2')).toBe(0.5);
    expect(getCountNmberFromString('1/10')).toBe(0.1);
    expect(getCountNmberFromString('2/8')).toBe(0.25);
	});
	
	it('should convert string to number', () => {
		expect(getCountNmberFromString('1')).toBe(1);
    expect(getCountNmberFromString('12')).toBe(12);
    expect(getCountNmberFromString('-5')).toBe(-5);
	})
});