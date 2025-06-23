
export const samplePrograms = [
  {
    name: "Hello World",
    code: `// A simple hello world program
program HelloWorld {
  function main() {
    print("Hello, World!");
    return 0;
  }
}`
  },
  {
    name: "Factorial",
    code: `// Recursive factorial calculation
program Factorial {
  function factorial(n: int): int {
    if (n <= 1) {
      return 1;
    }
    return n * factorial(n - 1);
  }

  function main() {
    var result: int = factorial(5);
    print("Factorial of 5 is: " + result);
    return 0;
  }
}`
  },
  {
    name: "Bubble Sort",
    code: `// Bubble sort implementation
program BubbleSort {
  function bubbleSort(arr: int[], size: int) {
    var i: int = 0;
    var j: int = 0;
    var temp: int = 0;
    
    for (i = 0; i < size - 1; i = i + 1) {
      for (j = 0; j < size - i - 1; j = j + 1) {
        if (arr[j] > arr[j + 1]) {
          // Swap elements
          temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
  }

  function main() {
    var numbers: int[] = [64, 34, 25, 12, 22, 11, 90];
    var size: int = 7;
    
    bubbleSort(numbers, size);
    
    print("Sorted array: ");
    var i: int = 0;
    for (i = 0; i < size; i = i + 1) {
      print(numbers[i] + " ");
    }
    
    return 0;
  }
}`
  }
];

export default samplePrograms;
