<script setup lang="ts">
import { ref } from "vue";

type Operation = "+" | "-" | "*" | "/" | null;
type ButtonType = "function" | "operator" | "number" | "equals";

interface Button {
  label: string;
  type: ButtonType;
  action: () => void;
  class?: string;
}

// Constants
const MAX_DISPLAY_LENGTH = 12;
const DECIMAL_PLACES = 8;
const EXPONENTIAL_PRECISION = 6;

const display = ref<string>("0");
const operation = ref<Operation>(null);
const waitingForNewValue = ref<boolean>(false);

// 数値ボタンが押されたときの処理
const inputNumber = (num: string): void => {
  // 演算子の後の数値入力
  if (waitingForNewValue.value) {
    display.value = display.value + num;
    waitingForNewValue.value = false;
    return;
  }
  
  // 既に式がある場合は末尾に追加
  if (display.value.includes(" ")) {
    display.value = display.value + num;
    return;
  }
  
  // 新しい数値入力
  display.value = display.value === "0" ? num : display.value + num;
};

// 小数点ボタンが押されたときの処理
const inputDecimal = (): void => {
  if (waitingForNewValue.value) {
    display.value += "0.";
    waitingForNewValue.value = false;
  } else if (display.value.indexOf(".") === -1) {
    display.value += ".";
  }
};

// 演算子ボタンが押されたときの処理
const inputOperator = (nextOperation: Operation): void => {
  // 演算子が連続で押された場合、追加で表示されないよう早期return
  if (display.value.split(" ").slice(-1)[0] == "") {
    return
  }

  // 演算子をディスプレイに表示
  let operatorSymbol;
  switch (nextOperation) {
    case "*":
      operatorSymbol = "×";
      break;
    case "/":
      operatorSymbol = "÷";
      break;
    default:
      operatorSymbol = nextOperation;
  }
  display.value = display.value + " " + operatorSymbol + " ";

  waitingForNewValue.value = true;
  operation.value = nextOperation;
};

// 実際の計算を実行する関数
const performCalculation = (displayArray: string[]): number => {
  // 左から右に順次計算
  let result = parseFloat(displayArray[0]);

  for (let i = 1; i < displayArray.length; i += 2) {
    const operator = displayArray[i];
    const operand = parseFloat(displayArray[i + 1]);

    switch (operator) {
      case "+":
        result += operand;
        break;
      case "-":
        result -= operand;
        break;
      case "×":
        result *= operand;
        break;
      case "÷":
        result = operand !== 0 ? result / operand : 0;
        break;
    }
  }

  return result;
};

// 計算結果を表示用にフォーマットする関数
const formatResult = (value: number): string => {
  if (value === 0) return "0";
  if (!isFinite(value)) return "Error";

  const str = value.toString();
  if (str.length > MAX_DISPLAY_LENGTH) {
    if (value < 1 && value > -1) {
      return value.toFixed(DECIMAL_PLACES);
    }
    return value.toExponential(EXPONENTIAL_PRECISION);
  }
  return str;
};

// イコールボタンが押されたときの処理
const calculate = (): void => {
  // 最初に入力した数値が表示かつ最後に表示されている数値が演算子ではない
  const displayArray = display.value.split(" ");
  if (displayArray.slice(-1)[0] !== "") {
    const newValue = performCalculation(displayArray);
    display.value = formatResult(newValue);
    operation.value = null;
    waitingForNewValue.value = true;
  }
};

// ACボタンが押されたときの処理（全クリア）
const clear = (): void => {
  display.value = "0";
  operation.value = null;
  waitingForNewValue.value = false;
};

// ±ボタンが押されたときの処理（正負切り替え）
const toggleSign = (): void => {
  const value = parseFloat(display.value);
  display.value = formatResult(-value);
};

// %ボタンが押されたときの処理（パーセント計算）
const percentage = (): void => {
  const value = parseFloat(display.value);
  display.value = formatResult(value / 100);
};

// Button configuration
const buttons: Button[] = [
  // Row 1
  { label: "AC", type: "function", action: clear },
  { label: "±", type: "function", action: toggleSign },
  { label: "%", type: "function", action: percentage },
  { label: "÷", type: "operator", action: () => inputOperator("/") },
  // Row 2
  { label: "7", type: "number", action: () => inputNumber("7") },
  { label: "8", type: "number", action: () => inputNumber("8") },
  { label: "9", type: "number", action: () => inputNumber("9") },
  { label: "×", type: "operator", action: () => inputOperator("*") },
  // Row 3
  { label: "4", type: "number", action: () => inputNumber("4") },
  { label: "5", type: "number", action: () => inputNumber("5") },
  { label: "6", type: "number", action: () => inputNumber("6") },
  { label: "-", type: "operator", action: () => inputOperator("-") },
  // Row 4
  { label: "1", type: "number", action: () => inputNumber("1") },
  { label: "2", type: "number", action: () => inputNumber("2") },
  { label: "3", type: "number", action: () => inputNumber("3") },
  { label: "+", type: "operator", action: () => inputOperator("+") },
  // Row 5
  { label: "0", type: "number", action: () => inputNumber("0"), class: "zero" },
  { label: ".", type: "number", action: inputDecimal },
  { label: "=", type: "equals", action: calculate },
];
</script>

<template>
  <div class="calculator">
    <input type="text" class="display" :value="display" readonly />
    <div class="buttons">
      <button
        v-for="(button, index) in buttons"
        :key="index"
        @click="button.action"
        :class="[button.type, button.class]"
      >
        {{ button.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.calculator {
  background: #2c3e50;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.display {
  width: 100%;
  height: 80px;
  font-size: 32px;
  text-align: right;
  padding: 0 15px;
  margin-bottom: 15px;
  border: none;
  background: #1a252f;
  color: #ecf0f1;
  border-radius: 10px;
  font-family: "Courier New", monospace;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 70px);
  gap: 12px;
}

button {
  height: 70px;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

button:active {
  transform: scale(0.95);
}

.number {
  background: #34495e;
  color: #ecf0f1;
}

.number:hover {
  background: #4a6741;
  box-shadow: 0 4px 12px rgba(74, 103, 65, 0.4);
}

.operator {
  background: #e74c3c;
  color: white;
}

.operator:hover {
  background: #c0392b;
  box-shadow: 0 4px 12px rgba(192, 57, 43, 0.4);
}

.function {
  background: #95a5a6;
  color: #2c3e50;
}

.function:hover {
  background: #bdc3c7;
  box-shadow: 0 4px 12px rgba(189, 195, 199, 0.4);
}

.equals {
  background: #27ae60;
  color: white;
}

.equals:hover {
  background: #229954;
  box-shadow: 0 4px 12px rgba(34, 153, 84, 0.4);
}

.zero {
  grid-column: span 2;
}
</style>
