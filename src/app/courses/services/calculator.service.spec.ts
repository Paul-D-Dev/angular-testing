import { CalculatorService } from './calculator.service';
import { LoggerService } from './logger.service';

describe('CalculatorService', () => {
  it('should be two numbers', () => {
    const calculator = new CalculatorService(new LoggerService());
    const result = calculator.add(2, 2);
    expect(result).toBe(4);
  });

  it('should be two numbers', () => {
    const calculator = new CalculatorService(new LoggerService());
    const result = calculator.subtract(2, 2);
    expect(result).toBe(0);
  });
});
