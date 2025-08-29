/**
 * Calculate the sum 1 + 2 + ... + n using Gauss' formula:
 *
 * Idea: Write the sequence forwards and backwards, then add each pair:
 *   (1 + 2 + 3 + ... + n)
 * + (n + (n-1) + ... + 2 + 1)
 * = n pairs, each equal to (n+1)
 * => Double sum = n * (n+1)
 * => Original sum = (n * (n+1)) / 2
 *
 * Complexity: O(1) (only a few arithmetic operations, no loop needed).
 */
function sum_to_n_formula(n: number): number {
  return (n * (n + 1)) / 2;
}

/**
 * Calculate the sum 1 + 2 + ... + n using a simple iterative loop.
 *
 * Approach: Start from 1 up to n, adding each number to an accumulator.
 * 
 * Complexity:
 *   - Time: O(n) (loop runs n times).
 *   - Space: O(1) (only uses a single accumulator variable).
 */
function sum_to_n_iterative(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

/**
 * Calculate the sum 1 + 2 + ... + n using recursion.
 *
 * Approach:
 *   - Base case: if n <= 1, return n.
 *   - Recursive case: return n + sum_to_n_recursive(n - 1).
 *   - This keeps calling the function until it reaches the base case.
 *
 * Complexity:
 *   - Time: O(n) (one recursive call for each number down to 1).
 *   - Space: O(n) (call stack grows linearly with n).
 * 
 * Note:
 *   This implementation is less efficient and may cause stack overflow
 *   for large n, compared to the iterative or formula-based approaches.
 */
function sum_to_n_recursive(n: number): number {
  if (n <= 1) return n;
  return n + sum_to_n_recursive(n - 1);
}

function main() {
  const n = 5000;
  
  const start = performance.now();
  const result = sum_to_n_formula(n);
  const end = performance.now();
  console.log(`Formula: ${result} in ${end - start}ms`);

  console.log("--------------------------------");
  const start2 = performance.now();
  const result2 = sum_to_n_iterative(n);
  const end2 = performance.now();
  console.log(`Iterative: ${result2} in ${end2 - start2}ms`);
  
  console.log("--------------------------------");
  const start3 = performance.now();
  const result3 = sum_to_n_recursive(n);
  const end3 = performance.now();
  console.log(`Recursive: ${result3} in ${end3 - start3}ms`);
}

main();


export { sum_to_n_formula, sum_to_n_iterative, sum_to_n_recursive };
