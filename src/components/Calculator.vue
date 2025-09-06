<template>
  <div class="calculator">
    <input 
      type="text" 
      class="display" 
      :value="display" 
      readonly
    >
    <div class="buttons">
      <button @click="clear" class="function">AC</button>
      <button @click="toggleSign" class="function">±</button>
      <button @click="percentage" class="function">%</button>
      <button @click="inputOperator('/')" class="operator">÷</button>
      
      <button @click="inputNumber('7')" class="number">7</button>
      <button @click="inputNumber('8')" class="number">8</button>
      <button @click="inputNumber('9')" class="number">9</button>
      <button @click="inputOperator('*')" class="operator">×</button>
      
      <button @click="inputNumber('4')" class="number">4</button>
      <button @click="inputNumber('5')" class="number">5</button>
      <button @click="inputNumber('6')" class="number">6</button>
      <button @click="inputOperator('-')" class="operator">-</button>
      
      <button @click="inputNumber('1')" class="number">1</button>
      <button @click="inputNumber('2')" class="number">2</button>
      <button @click="inputNumber('3')" class="number">3</button>
      <button @click="inputOperator('+')" class="operator">+</button>
      
      <button @click="inputNumber('0')" class="number zero">0</button>
      <button @click="inputDecimal" class="number">.</button>
      <button @click="calculate" class="equals">=</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Operation = '+' | '-' | '*' | '/' | null

const display = ref<string>('0')
const previousValue = ref<number | null>(null)
const operation = ref<Operation>(null)
const waitingForNewValue = ref<boolean>(false)

const inputNumber = (num: string): void => {
  if (waitingForNewValue.value) {
    display.value = num
    waitingForNewValue.value = false
  } else {
    display.value = display.value === '0' ? num : display.value + num
  }
}

const inputDecimal = (): void => {
  if (waitingForNewValue.value) {
    display.value = '0.'
    waitingForNewValue.value = false
  } else if (display.value.indexOf('.') === -1) {
    display.value += '.'
  }
}

const inputOperator = (nextOperation: Operation): void => {
  const inputValue = parseFloat(display.value)

  if (previousValue.value === null) {
    previousValue.value = inputValue
  } else if (operation.value) {
    const newValue = performCalculation()
    display.value = formatResult(newValue)
    previousValue.value = newValue
  }

  waitingForNewValue.value = true
  operation.value = nextOperation
}

const performCalculation = (): number => {
  const prev = previousValue.value!
  const current = parseFloat(display.value)

  switch (operation.value) {
    case '+':
      return prev + current
    case '-':
      return prev - current
    case '*':
      return prev * current
    case '/':
      return current !== 0 ? prev / current : 0
    default:
      return current
  }
}

const formatResult = (value: number): string => {
  if (value === 0) return '0'
  if (!isFinite(value)) return 'Error'
  
  const str = value.toString()
  if (str.length > 12) {
    if (value < 1 && value > -1) {
      return value.toFixed(8)
    }
    return value.toExponential(6)
  }
  return str
}

const calculate = (): void => {
  if (operation.value && previousValue.value !== null) {
    const newValue = performCalculation()
    display.value = formatResult(newValue)
    previousValue.value = null
    operation.value = null
    waitingForNewValue.value = true
  }
}

const clear = (): void => {
  display.value = '0'
  previousValue.value = null
  operation.value = null
  waitingForNewValue.value = false
}

const toggleSign = (): void => {
  const value = parseFloat(display.value)
  display.value = formatResult(-value)
}

const percentage = (): void => {
  const value = parseFloat(display.value)
  display.value = formatResult(value / 100)
}
</script>

<style scoped>
.calculator {
  background: #2c3e50;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
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
  font-family: 'Courier New', monospace;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);
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