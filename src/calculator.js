#!/usr/bin/env node
/**
 * Calculadora CLI com as quatro operações aritméticas básicas.
 *
 * Operações suportadas (nome ou símbolo equivalente):
 *   - add,      +   Adição:         a + b
 *   - subtract, -   Subtração:      a - b
 *   - multiply, *   Multiplicação:  a * b
 *   - divide,   /   Divisão:        a / b (b não pode ser zero)
 *
 * Uso:
 *   node src/calculator.js <operação> <número1> <número2>
 *
 * Exemplos:
 *   node src/calculator.js add 2 3        # 5
 *   node src/calculator.js subtract 10 4  # 6
 *   node src/calculator.js multiply 3 7   # 21
 *   node src/calculator.js divide 8 2     # 4
 */

const OPERATIONS = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => {
    if (b === 0) {
      throw new Error('Divisão por zero não é permitida.');
    }
    return a / b;
  },
};

// Símbolos aceitos como atalhos para as operações acima.
const SYMBOLS = {
  '+': 'add',
  '-': 'subtract',
  '*': 'multiply',
  '/': 'divide',
};

function parseNumber(value) {
  if (typeof value === 'string' && value.trim() === '') {
    throw new Error(`Valor inválido: "${value}" não é um número.`);
  }
  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(number)) {
    throw new Error(`Valor inválido: "${value}" não é um número.`);
  }
  return number;
}

function calculate(operation, a, b) {
  const name = SYMBOLS[operation] || operation;
  const fn = OPERATIONS[name];
  if (!fn) {
    throw new Error(
      `Operação desconhecida: "${operation}". Use add, subtract, multiply ou divide (ou +, -, *, /).`
    );
  }
  return fn(parseNumber(a), parseNumber(b));
}

function main(argv) {
  const [operation, a, b] = argv;
  if (!operation || a === undefined || b === undefined) {
    console.error('Uso: node src/calculator.js <add|subtract|multiply|divide> <número1> <número2>');
    return 1;
  }

  try {
    console.log(calculate(operation, a, b));
    return 0;
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    return 1;
  }
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}

module.exports = { calculate, OPERATIONS };
