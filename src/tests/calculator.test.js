const { execFileSync } = require('child_process');
const path = require('path');
const { addition, subtraction, multiplication, division, calculate, OPERATIONS } = require('../calculator');

const CLI_PATH = path.join(__dirname, '..', 'calculator.js');

function runCli(args) {
  try {
    const stdout = execFileSync(process.execPath, [CLI_PATH, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { status: 0, stdout, stderr: '' };
  } catch (error) {
    return { status: error.status, stdout: error.stdout, stderr: error.stderr };
  }
}

describe('calculator', () => {
  describe('exposed operations', () => {
    test('exports all supported operations', () => {
      expect(Object.keys(OPERATIONS).sort()).toEqual([
        'addition',
        'division',
        'modulo',
        'multiplication',
        'power',
        'squareRoot',
        'subtraction',
      ]);
    });

    test('exports addition, subtraction, multiplication and division as functions', () => {
      expect(addition(2, 3)).toBe(5);
      expect(subtraction(10, 4)).toBe(6);
      expect(multiplication(45, 2)).toBe(90);
      expect(division(20, 5)).toBe(4);
      expect(() => division(1, 0)).toThrow('Divisão por zero não é permitida.');
    });

    test('accepts full operation names in calculate', () => {
      expect(calculate('addition', 2, 3)).toBe(5);
      expect(calculate('division', 20, 5)).toBe(4);
    });
  });

  describe('addition', () => {
    test('adds the examples from the image: 2 + 3 = 5', () => {
      expect(calculate('add', 2, 3)).toBe(5);
    });

    test('adds negative numbers', () => {
      expect(calculate('add', -2, -3)).toBe(-5);
      expect(calculate('add', -2, 3)).toBe(1);
    });

    test('adds decimal numbers', () => {
      expect(calculate('add', 0.1, 0.2)).toBeCloseTo(0.3);
    });

    test('adds zero as identity', () => {
      expect(calculate('add', 7, 0)).toBe(7);
    });
  });

  describe('subtraction', () => {
    test('subtracts the examples from the image: 10 - 4 = 6', () => {
      expect(calculate('subtract', 10, 4)).toBe(6);
    });

    test('returns a negative result when the second operand is larger', () => {
      expect(calculate('subtract', 4, 10)).toBe(-6);
    });

    test('subtracting zero keeps the value', () => {
      expect(calculate('subtract', 5, 0)).toBe(5);
    });

    test('subtracting a number from itself returns zero', () => {
      expect(calculate('subtract', 9, 9)).toBe(0);
    });
  });

  describe('multiplication', () => {
    test('multiplies the examples from the image: 45 * 2 = 90', () => {
      expect(calculate('multiply', 45, 2)).toBe(90);
    });

    test('multiplying by zero returns zero', () => {
      expect(calculate('multiply', 123, 0)).toBe(0);
    });

    test('multiplying two negatives returns a positive', () => {
      expect(calculate('multiply', -4, -5)).toBe(20);
    });

    test('multiplies decimal numbers', () => {
      expect(calculate('multiply', 2.5, 4)).toBe(10);
    });
  });

  describe('division', () => {
    test('divides the examples from the image: 20 / 5 = 4', () => {
      expect(calculate('divide', 20, 5)).toBe(4);
    });

    test('returns decimal results for non-exact division', () => {
      expect(calculate('divide', 1, 4)).toBe(0.25);
    });

    test('divides negative numbers', () => {
      expect(calculate('divide', -20, 5)).toBe(-4);
      expect(calculate('divide', -20, -5)).toBe(4);
    });

    test('zero divided by a non-zero number returns zero', () => {
      expect(calculate('divide', 0, 5)).toBe(0);
    });

    test('throws when dividing by zero', () => {
      expect(() => calculate('divide', 10, 0)).toThrow('Divisão por zero não é permitida.');
    });

    test('throws when dividing zero by zero', () => {
      expect(() => calculate('divide', 0, 0)).toThrow('Divisão por zero não é permitida.');
    });

    test('throws when dividing a negative number by zero', () => {
      expect(() => calculate('divide', -5, 0)).toThrow('Divisão por zero não é permitida.');
    });
  });

  describe('modulo', () => {
    test('returns the remainder: 10 % 3 = 1', () => {
      expect(calculate('modulo', 10, 3)).toBe(1);
    });

    test('returns zero when the division is exact', () => {
      expect(calculate('modulo', 9, 3)).toBe(0);
    });

    test('keeps the sign of the dividend, as JavaScript does', () => {
      expect(calculate('modulo', -7, 3)).toBe(-1);
    });

    test('throws when the divisor is zero', () => {
      expect(() => calculate('modulo', 10, 0)).toThrow('Módulo por zero não é permitido.');
    });
  });

  describe('power', () => {
    test('raises the base to the exponent: 2 ^ 10 = 1024', () => {
      expect(calculate('power', 2, 10)).toBe(1024);
    });

    test('any number to the power of zero is one', () => {
      expect(calculate('power', 7, 0)).toBe(1);
    });

    test('supports negative exponents', () => {
      expect(calculate('power', 2, -2)).toBe(0.25);
    });

    test('accepts the pow and ** aliases', () => {
      expect(calculate('pow', 2, 3)).toBe(8);
      expect(calculate('**', 2, 3)).toBe(8);
    });

    test('throws when the result is not finite', () => {
      expect(() => calculate('power', 10, 400)).toThrow(
        'Resultado indefinido ou fora do intervalo numérico.'
      );
    });

    test('throws when the result is undefined', () => {
      expect(() => calculate('power', -8, 1 / 3)).toThrow(
        'Resultado indefinido ou fora do intervalo numérico.'
      );
    });
  });

  describe('squareRoot', () => {
    test('returns the square root: sqrt(16) = 4', () => {
      expect(calculate('squareRoot', 16)).toBe(4);
    });

    test('returns decimal results', () => {
      expect(calculate('squareRoot', 2)).toBeCloseTo(1.41421356);
    });

    test('square root of zero is zero', () => {
      expect(calculate('squareRoot', 0)).toBe(0);
    });

    test('throws for negative numbers', () => {
      expect(() => calculate('squareRoot', -4)).toThrow(
        'Raiz quadrada de número negativo não é permitida.'
      );
    });

    test('accepts the sqrt alias', () => {
      expect(calculate('sqrt', 25)).toBe(5);
    });
  });

  describe('operand count', () => {
    test('throws when a binary operation receives one operand', () => {
      expect(() => calculate('addition', 1)).toThrow('espera 2 operando(s), mas recebeu 1.');
    });

    test('throws when a unary operation receives two operands', () => {
      expect(() => calculate('squareRoot', 4, 2)).toThrow('espera 1 operando(s), mas recebeu 2.');
    });
  });

  describe('operation symbols', () => {
    test.each([
      ['+', 2, 3, 5],
      ['-', 10, 4, 6],
      ['*', 45, 2, 90],
      ['/', 20, 5, 4],
      ['%', 10, 3, 1],
      ['**', 2, 10, 1024],
    ])('symbol %s behaves like its operation (%p, %p -> %p)', (symbol, a, b, expected) => {
      expect(calculate(symbol, a, b)).toBe(expected);
    });
  });

  describe('operand parsing', () => {
    test('accepts numeric strings as operands', () => {
      expect(calculate('add', '2', '3')).toBe(5);
    });

    test('ignores surrounding whitespace in numeric strings', () => {
      expect(calculate('multiply', ' 7 ', '6')).toBe(42);
    });

    test.each([
      ['empty string', ''],
      ['whitespace only', '   '],
      ['letters', 'abc'],
      ['mixed text', '12px'],
      ['Infinity', 'Infinity'],
      ['NaN', 'NaN'],
    ])('rejects invalid operand: %s', (_label, value) => {
      expect(() => calculate('add', value, 1)).toThrow('não é um número');
      expect(() => calculate('add', 1, value)).toThrow('não é um número');
    });

    test('rejects non-finite numeric operands', () => {
      expect(() => calculate('divide', Infinity, 2)).toThrow('não é um número');
    });
  });

  describe('unknown operations', () => {
    test('throws for an unsupported operation name', () => {
      expect(() => calculate('exponentiation', 2, 3)).toThrow('Operação desconhecida: "exponentiation"');
    });

    test('is case sensitive for operation names', () => {
      expect(() => calculate('ADD', 2, 3)).toThrow('Operação desconhecida');
    });
  });
});

describe('calculator CLI', () => {
  test('prints the result and exits with 0 for the image examples', () => {
    expect(runCli(['add', '2', '3'])).toEqual({ status: 0, stdout: '5\n', stderr: '' });
    expect(runCli(['subtract', '10', '4']).stdout).toBe('6\n');
    expect(runCli(['multiply', '45', '2']).stdout).toBe('90\n');
    expect(runCli(['divide', '20', '5']).stdout).toBe('4\n');
  });

  test('accepts symbols as operations', () => {
    expect(runCli(['+', '2', '3']).stdout).toBe('5\n');
    expect(runCli(['*', '45', '2']).stdout).toBe('90\n');
  });

  test('prints an error and exits with 1 on division by zero', () => {
    const result = runCli(['divide', '1', '0']);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Divisão por zero não é permitida.');
  });

  test('prints usage and exits with 1 when no operation is given', () => {
    const result = runCli([]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Uso:');
  });

  test('prints an error and exits with 1 when operand count is wrong', () => {
    const result = runCli(['add', '1']);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('espera 2 operando(s)');
  });

  test('computes square root with a single operand', () => {
    expect(runCli(['squareRoot', '16']).stdout).toBe('4\n');
  });

  test('prints an error and exits with 1 for invalid operands', () => {
    const result = runCli(['add', 'abc', '1']);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('"abc" não é um número');
  });
});
