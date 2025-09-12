import { ref, computed } from 'vue'

export type Operation = '+' | '-' | '*' | '/' | null
export type ButtonType = 'function' | 'operator' | 'number' | 'equals'

export interface Button {
  label: string
  type: ButtonType
  action: () => void
  class?: string
}

const MAX_DISPLAY_LENGTH = 12
const DECIMAL_PLACES = 8
const EXPONENTIAL_PRECISION = 6

export const useCalculator = () => {
  const display = ref<string>('0')
  const operation = ref<Operation>(null)
  const waitingForNewValue = ref<boolean>(false)

  // 実際の計算を実行する関数
  const performCalculation = (displayArray: string[]): number => {
    let result = parseFloat(displayArray[0])

    for (let i = 1; i < displayArray.length; i += 2) {
      const operator = displayArray[i]
      const operand = parseFloat(displayArray[i + 1])

      switch (operator) {
        case '+':
          result += operand
          break
        case '-':
          result -= operand
          break
        case '×':
          result *= operand
          break
        case '÷':
          result = operand !== 0 ? result / operand : 0
          break
      }
    }

    return result
  }

  // 計算結果を表示用にフォーマットする関数
  const formatResult = (value: number): string => {
    if (value === 0) return '0'
    if (!isFinite(value)) return 'Error'

    const str = value.toString()
    if (str.length > MAX_DISPLAY_LENGTH) {
      if (value < 1 && value > -1) {
        return value.toFixed(DECIMAL_PLACES)
      }
      return value.toExponential(EXPONENTIAL_PRECISION)
    }
    return str
  }

  // 数値ボタンが押されたときの処理
  const inputNumber = (num: string): void => {
    if (waitingForNewValue.value) {
      display.value = display.value + num
      waitingForNewValue.value = false
      return
    }

    if (display.value.includes(' ')) {
      display.value = display.value + num
      return
    }

    display.value = display.value === '0' ? num : display.value + num
  }

  // 小数点ボタンが押されたときの処理
  const inputDecimal = (): void => {
    if (waitingForNewValue.value) {
      display.value += '0.'
      waitingForNewValue.value = false
    } else if (display.value.indexOf('.') === -1) {
      display.value += '.'
    }
  }

  // 演算子ボタンが押されたときの処理
  const inputOperator = (nextOperation: Operation): void => {
    // 演算子が連続で押された場合、追加で表示されないよう早期return
    if (['+', '-', '×', '÷', '*', '/'].includes(display.value.slice(-1))) {
      return
    }

    // 演算子をディスプレイに表示
    let operatorSymbol
    switch (nextOperation) {
      case '*':
        operatorSymbol = '×'
        break
      case '/':
        operatorSymbol = '÷'
        break
      default:
        operatorSymbol = nextOperation
    }

    display.value = display.value + operatorSymbol
    operation.value = nextOperation
    waitingForNewValue.value = true
  }

  // イコールボタンが押されたときの処理
  const calculate = (): void => {
    const displayArray = display.value.match(/\d+\.?\d*|[×÷+-]/g) || []

    // 最後の入力が演算子の場合、計算されないようにする
    if (['+', '-', '×', '÷', '*', '/'].includes(display.value.slice(-1))) {
      return
    }

    if (displayArray.slice(-1)[0] !== '') {
      const newValue = performCalculation(displayArray)
      display.value = formatResult(newValue)
      operation.value = null
      waitingForNewValue.value = true
    }
  }

  // ACボタンが押されたときの処理（全クリア）
  const clear = (): void => {
    display.value = '0'
    operation.value = null
    waitingForNewValue.value = false
  }

  // delボタンが押されたときの処理（最後に入力した文字列を削除）
  const del = (): void => {
    if (display.value.length > 1) {
      // 最後の文字を削除
      display.value = display.value.slice(0, -1)
    } else {
      // 1文字しかない場合は'0'にリセット
      display.value = '0'
    }

    operation.value = null
    waitingForNewValue.value = false
  }

  // ±ボタンが押されたときの処理（正負切り替え）
  const toggleSign = (): void => {
    const value = parseFloat(display.value)
    display.value = formatResult(-value)
  }

  // %ボタンが押されたときの処理（パーセント計算）
  const percentage = (): void => {
    const value = parseFloat(display.value)
    display.value = formatResult(value / 100)
  }

  const buttons = computed<Button[]>(() => [
    // Row 1
    display.value === '0'
      ? { label: 'AC', type: 'function', action: clear }
      : { label: 'del', type: 'function', action: del },
    { label: '±', type: 'function', action: toggleSign },
    { label: '%', type: 'function', action: percentage },
    { label: '÷', type: 'operator', action: () => inputOperator('/') },
    // Row 2
    { label: '7', type: 'number', action: () => inputNumber('7') },
    { label: '8', type: 'number', action: () => inputNumber('8') },
    { label: '9', type: 'number', action: () => inputNumber('9') },
    { label: '×', type: 'operator', action: () => inputOperator('*') },
    // Row 3
    { label: '4', type: 'number', action: () => inputNumber('4') },
    { label: '5', type: 'number', action: () => inputNumber('5') },
    { label: '6', type: 'number', action: () => inputNumber('6') },
    { label: '-', type: 'operator', action: () => inputOperator('-') },
    // Row 4
    { label: '1', type: 'number', action: () => inputNumber('1') },
    { label: '2', type: 'number', action: () => inputNumber('2') },
    { label: '3', type: 'number', action: () => inputNumber('3') },
    { label: '+', type: 'operator', action: () => inputOperator('+') },
    // Row 5
    {
      label: '0',
      type: 'number',
      action: () => inputNumber('0'),
      class: 'zero',
    },
    { label: '.', type: 'number', action: inputDecimal },
    { label: '=', type: 'equals', action: calculate },
  ])

  return {
    display,
    buttons,
  }
}
