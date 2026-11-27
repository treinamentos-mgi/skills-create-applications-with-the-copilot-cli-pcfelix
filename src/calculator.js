#!/usr/bin/env node
/**
 * Calculadora CLI com operações aritméticas básicas, módulo, exponenciação e raiz quadrada.
 *
 * Operações suportadas:
 *   - addition        Adição:          a + b
 *   - subtraction     Subtração:       a - b
 *   - multiplication  Multiplicação:   a * b
 *   - division        Divisão:         a / b (b não pode ser zero)
 *   - modulo          Módulo (resto):  a % b (b não pode ser zero)
 *   - power           Potência:        a ^ b
 *   - squareRoot      Raiz quadrada:   √a (a não pode ser negativo; recebe 1 operando)
 *
 * Atalhos aceitos na CLI: add, subtract, multiply, divide, mod, pow, sqrt,
 * +, -, *, /, %, **.
 *
 * Uso:
 *   node src/calculator.js <operação> <número1> [número2]
 *
 * Exemplos:
 *   node src/calculator.js addition 2 3        # 5
 *   node src/calculator.js subtraction 10 4    # 6
 *   node src/calculator.js multiplication 3 7  # 21
 *   node src/calculator.js division 8 2        # 4
 *   node src/calculator.js modulo 10 3         # 1
 *   node src/calculator.js power 2 10         # 1024
 *   node src/calculator.js squareRoot 16       # 4
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

function modulo(a, b) {
  if (b === 0) {
    throw new Error('Módulo por zero não é permitido.');
  }
  return a % b;
}

function power(base, exponent) {
  return base ** exponent;
}

function squareRoot(n) {
  if (n < 0) {
    throw new Error('Raiz quadrada de número negativo não é permitida.');
  }
  return Math.sqrt(n);
}

const OPERATIONS = {
  addition,
  subtraction,
  multiplication,
  division,
  modulo,
  power,
  squareRoot,
};

// Atalhos (nomes curtos e símbolos) mapeados para os nomes das operações.
const ALIASES = {
  add: 'addition',
  subtract: 'subtraction',
  multiply: 'multiplication',
  divide: 'division',
  mod: 'modulo',
  pow: 'power',
  sqrt: 'squareRoot',
  '+': 'addition',
  '-': 'subtraction',
  '*': 'multiplication',
  '/': 'division',
  '%': 'modulo',
  '**': 'power',
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

function calculate(operation, ...operands) {
  const name = Object.hasOwn(ALIASES, operation) ? ALIASES[operation] : operation;
  if (!Object.hasOwn(OPERATIONS, name)) {
    throw new Error(
      `Operação desconhecida: "${operation}". Use addition, subtraction, multiplication, division, modulo, power ou squareRoot (ou os atalhos da documentação).`
    );
  }
  const fn = OPERATIONS[name];
  if (operands.length !== fn.length) {
    throw new Error(
      `A operação "${name}" espera ${fn.length} operando(s), mas recebeu ${operands.length}.`
    );
  }
  const result = fn(...operands.map(parseNumber));
  if (!Number.isFinite(result)) {
    throw new Error('Resultado indefinido ou fora do intervalo numérico.');
  }
  return result;
}

function main(argv) {
  const [operation, ...operands] = argv;
  if (!operation) {
    console.error(
      'Uso: node src/calculator.js <addition|subtraction|multiplication|division|modulo|power|squareRoot> <número1> [número2]'
    );
    return 1;
  }

  try {
    console.log(calculate(operation, ...operands));
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
  modulo,
  power,
  squareRoot,
  calculate,
  OPERATIONS,
};
