#!/usr/bin/env ts-node

import * as readline from 'readline';
import { sum_to_n_formula, sum_to_n_iterative, sum_to_n_recursive } from './index';

interface Command {
  name: string;
  description: string;
  execute: (args: string[]) => void;
}

class SumCalculatorCLI {
  private rl: readline.Interface;
  private commands: Map<string, Command>;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    this.commands = new Map();
    this.initializeCommands();
  }

  private initializeCommands(): void {
    this.commands.set('help', {
      name: 'help',
      description: 'Show available commands',
      execute: () => this.showHelp()
    });

    this.commands.set('formula', {
      name: 'formula <n>',
      description: 'Calculate sum from 1 to n using Gauss formula',
      execute: (args) => this.calculateWithFormula(args)
    });

    this.commands.set('iterative', {
      name: 'iterative <n>',
      description: 'Calculate sum from 1 to n using loop',
      execute: (args) => this.calculateWithIterative(args)
    });

    this.commands.set('recursive', {
      name: 'recursive <n>',
      description: 'Calculate sum from 1 to n using recursion',
      execute: (args) => this.calculateWithRecursive(args)
    });

    this.commands.set('compare', {
      name: 'compare <n>',
      description: 'Compare performance of all 3 methods',
      execute: (args) => this.compareMethods(args)
    });

    this.commands.set('exit', {
      name: 'exit',
      description: 'Exit the program',
      execute: () => this.exit()
    });
  }

  private showHelp(): void {
    console.log('\n=== SUM CALCULATOR CLI ===');
    console.log('Available commands:\n');

    this.commands.forEach((command) => {
      console.log(`${command.name.padEnd(20)} - ${command.description}`);
    });

    console.log('\nExamples:');
    console.log('  formula 100     - Calculate sum from 1 to 100 using formula');
    console.log('  iterative 50    - Calculate sum from 1 to 50 using loop');
    console.log('  recursive 10    - Calculate sum from 1 to 10 using recursion');
    console.log('  compare 1000    - Compare all 3 methods with n=1000');
    console.log('');
  }

  private validateNumber(n: string): number | null {
    const num = parseInt(n);
    if (isNaN(num) || num <= 0) {
      console.log('❌ Error: Please enter a valid positive integer');
      return null;
    }
    return num;
  }

  private calculateWithFormula(args: string[]): void {
    if (args.length !== 1) {
      console.log('❌ Error: Please enter a number. Example: formula 100');
      return;
    }

    const n = this.validateNumber(args[0]);
    if (n === null) return;

    console.log(`\n🧮 Calculating sum from 1 to ${n} using Gauss formula...`);

    const start = performance.now();
    const result = sum_to_n_formula(n);
    const end = performance.now();

    console.log(`✅ Result: ${result.toLocaleString()}`);
    console.log(`⏱️  Time: ${(end - start).toFixed(4)}ms`);
    console.log(`📊 Formula: (${n} × ${n + 1}) ÷ 2 = ${result}`);
  }

  private calculateWithIterative(args: string[]): void {
    if (args.length !== 1) {
      console.log('❌ Error: Please enter a number. Example: iterative 100');
      return;
    }

    const n = this.validateNumber(args[0]);
    if (n === null) return;

    console.log(`\n🔄 Calculating sum from 1 to ${n} using loop...`);

    const start = performance.now();
    const result = sum_to_n_iterative(n);
    const end = performance.now();

    console.log(`✅ Result: ${result.toLocaleString()}`);
    console.log(`⏱️  Time: ${(end - start).toFixed(4)}ms`);
    console.log(`📊 Method: Loop from 1 to ${n}`);
  }

  private calculateWithRecursive(args: string[]): void {
    if (args.length !== 1) {
      console.log('❌ Error: Please enter a number. Example: recursive 100');
      return;
    }

    const n = this.validateNumber(args[0]);
    if (n === null) return;

    if (n > 10000) {
      console.log('⚠️  Warning: Large number may cause stack overflow with recursion');
      console.log('   Recommended to use other methods for n > 10000');
    }

    console.log(`\n🔄 Calculating sum from 1 to ${n} using recursion...`);

    try {
      const start = performance.now();
      const result = sum_to_n_recursive(n);
      const end = performance.now();

      console.log(`✅ Result: ${result.toLocaleString()}`);
      console.log(`⏱️  Time: ${(end - start).toFixed(4)}ms`);
      console.log(`📊 Method: Recursion f(${n}) = ${n} + f(${n - 1})`);
    } catch (error) {
      console.log('❌ Error: Stack overflow - number too large for recursive method');
    }
  }

  private compareMethods(args: string[]): void {
    if (args.length !== 1) {
      console.log('❌ Error: Please enter a number. Example: compare 1000');
      return;
    }

    const n = this.validateNumber(args[0]);
    if (n === null) return;

    console.log(`\n📊 PERFORMANCE COMPARISON - SUM FROM 1 TO ${n.toLocaleString()}`);
    console.log('='.repeat(60));

    const results: Array<{ method: string, result: number, time: number }> = [];

    // Formula
    const start1 = performance.now();
    const result1 = sum_to_n_formula(n);
    const end1 = performance.now();
    results.push({ method: 'Gauss Formula', result: result1, time: end1 - start1 });

    // Iterative
    const start2 = performance.now();
    const result2 = sum_to_n_iterative(n);
    const end2 = performance.now();
    results.push({ method: 'Loop', result: result2, time: end2 - start2 });

    // Recursive (with error handling)
    let result3: number | null = null;
    let time3: number = 0;

    try {
      const start3 = performance.now();
      result3 = sum_to_n_recursive(n);
      const end3 = performance.now();
      time3 = end3 - start3;
      results.push({ method: 'Recursion', result: result3, time: time3 });
    } catch (error) {
      console.log('⚠️  Recursion: Stack overflow');
      results.push({ method: 'Recursion (Stack overflow)', result: 0, time: 0 });
    }

    // Display results
    console.log('\n📈 RESULTS:');
    results.forEach((r, index) => {
      const status = r.result === result1 ? '✅' : '❌';
      console.log(`${index + 1}. ${r.method.padEnd(15)} | ${status} ${r.result.toLocaleString().padStart(12)} | ⏱️  ${r.time.toFixed(4)}ms`);
    });

    // Find fastest
    const fastest = results.reduce((min, current) =>
      current.time < min.time ? current : min
    );

    console.log(`\n🏆 Fastest: ${fastest.method} (${fastest.time.toFixed(4)}ms)`);

    // Verify all results are the same
    const allSame = results.every(r => r.result === result1);
    if (allSame) {
      console.log('✅ All methods produce the same result');
    } else {
      console.log('❌ Results differ between methods!');
    }
  }

  private exit(): void {
    console.log('\n👋 Goodbye!');
    this.rl.close();
    process.exit(0);
  }

  private processCommand(input: string): void {
    const trimmed = input.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const command = this.commands.get(commandName);
    if (command) {
      command.execute(args);
    } else {
      console.log(`❌ Command not found: ${commandName}`);
      console.log('Type "help" to see available commands');
    }
  }

  public start(): void {
    console.log('🎯 SUM CALCULATOR CLI');
    this.showHelp();

    this.rl.on('line', (input) => {
      this.processCommand(input);
      console.log(''); // Empty line for better readability
    });

    this.rl.on('close', () => {
      console.log('\n👋 Goodbye!');
      process.exit(0);
    });
  }
}

// Start the CLI
if (require.main === module) {
  const cli = new SumCalculatorCLI();
  cli.start();
}
