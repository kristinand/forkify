import { getStepFromCount } from './listView';

describe('listView getStepFromCount function', () => {
  it('should return "1" if Count is integer', () => {
    expect(getStepFromCount(20)).toBe('1');
    expect(getStepFromCount(247842984203)).toBe('1');
  });

  it('should return "0.x" from y.x number', () => {
    expect(getStepFromCount(55.25)).toBe('0.25');
    expect(getStepFromCount(-3.125)).toBe('0.125');
    expect(getStepFromCount(20.1231231)).toBe('0.1231231');
  });
});
