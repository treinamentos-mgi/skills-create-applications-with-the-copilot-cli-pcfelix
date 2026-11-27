#!/usr/bin/env node
/**
 * Calculadora CLI com as quatro operações aritméticas básicas.
 *
 * Operações suportadas:
 *   - addition        Adição:         a + b
 *   - subtraction     Subtração:      a - b
 *   - multiplication  Multiplicação:  a * b
 *   - division        Divisão:        a / b (b não pode ser zero)
 *
 * Atalhos aceitos na CLI: add, subtract, multiply, divide, +, -, *, /.
 *
 * Uso:
 *   node src/calculator.js <operação> <número1> <número2>
 *
 * Exemplos:
 *   node src/calculator.js addition 2 3        # 5
 *   node src/calculator.js subtraction 10 4    # 6
 *   node src/calculator.js multiplication 3 7  # 21
 *   node src/calculator.js division 8 2        # 4
 */

function addition(a, b) {
  return a + b;
}

function subtraction(a, b) {
  return a - b;
}

function multiplication(a, b) {
  return a * b;
}

function division(a, b) {
  if (b === 0) {
    throw new Error('Divisão por zero não é permitida.');
  }
  return a / b;
}

const OPERATIONS = { addition, subtraction, multiplication, division };

// Atalhos (nomes curtos e símbolos) mapeados para os nomes das operações.
const ALIASES = {
  add: 'addition',
  subtract: 'subtraction',
  multiply: 'multiplication',
  divide: 'division',
  '+': 'addition',
  '-': 'subtraction',
  '*': 'multiplication',
  '/': 'division',
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
  const name = Object.hasOwn(ALIASES, operation) ? ALIASES[operation] : operation;
  if (!Object.hasOwn(OPERATIONS, name)) {
    throw new Error(
      `Operação desconhecida: "${operation}". Use addition, subtraction, multiplication ou division (ou add, subtract, multiply, divide, +, -, *, /).`
    );
  }
  return OPERATIONS[name](parseNumber(a), parseNumber(b));
}

function main(argv) {
  const [operation, a, b] = argv;
  if (!operation || a === undefined || b === undefined) {
    console.error('Uso: node src/calculator.js <addition|subtraction|multiplication|division> <número1> <número2>');
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

module.exports = {
  addition,
  subtraction,
  multiplication,
  division,
  calculate,
  OPERATIONS,
};
