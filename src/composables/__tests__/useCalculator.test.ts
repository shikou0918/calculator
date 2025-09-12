import { useCalculator } from '../useCalculator'

describe('useCalculator', () => {
  let calculator: ReturnType<typeof useCalculator>

  beforeEach(() => {
    calculator = useCalculator()
  })

  describe('初期状態', () => {
    it('初期表示が0であること', () => {
      expect(calculator.display.value).toBe('0')
    })

    it('ボタンが正しく設定されていること', () => {
      expect(calculator.buttons.value).toHaveLength(19)
      expect(calculator.buttons.value[0].label).toBe('AC')
      expect(calculator.buttons.value[18].label).toBe('=')
    })
  })

  describe('数値入力', () => {
    it('単一の数値が入力できること', () => {
      const button7 = calculator.buttons.value.find((b) => b.label === '7')!
      button7.action()
      expect(calculator.display.value).toBe('7')
    })

    it('初期状態の0を上書きできること', () => {
      const button5 = calculator.buttons.value.find((b) => b.label === '5')!
      button5.action()
      expect(calculator.display.value).toBe('5')
    })

    it('複数の数値が入力できること', () => {
      const button1 = calculator.buttons.value.find((b) => b.label === '1')!
      const button2 = calculator.buttons.value.find((b) => b.label === '2')!
      const button3 = calculator.buttons.value.find((b) => b.label === '3')!

      button1.action()
      button2.action()
      button3.action()
      expect(calculator.display.value).toBe('123')
    })
  })

  describe('小数点入力', () => {
    it('小数点が入力できること', () => {
      const button1 = calculator.buttons.value.find((b) => b.label === '1')!
      const buttonDecimal = calculator.buttons.value.find(
        (b) => b.label === '.'
      )!
      const button5 = calculator.buttons.value.find((b) => b.label === '5')!

      button1.action()
      buttonDecimal.action()
      button5.action()
      expect(calculator.display.value).toBe('1.5')
    })

    it('重複する小数点が入力されないこと', () => {
      const buttonDecimal = calculator.buttons.value.find(
        (b) => b.label === '.'
      )!

      buttonDecimal.action()
      buttonDecimal.action()
      expect(calculator.display.value).toBe('0.')
    })

    it('演算子の後に小数点が入力できること', () => {
      const button5 = calculator.buttons.value.find((b) => b.label === '5')!
      const buttonPlus = calculator.buttons.value.find((b) => b.label === '+')!
      const buttonDecimal = calculator.buttons.value.find(
        (b) => b.label === '.'
      )!
      const button3 = calculator.buttons.value.find((b) => b.label === '3')!

      button5.action()
      buttonPlus.action()
      buttonDecimal.action()
      button3.action()
      expect(calculator.display.value).toBe('5+0.3')
    })
  })

  describe('演算子入力', () => {
    it('加算演算子が入力できること', () => {
      const button5 = calculator.buttons.value.find((b) => b.label === '5')!
      const buttonPlus = calculator.buttons.value.find((b) => b.label === '+')!

      button5.action()
      buttonPlus.action()
      expect(calculator.display.value).toBe('5+')
    })

    it('減算演算子が入力できること', () => {
      const button5 = calculator.buttons.value.find((b) => b.label === '5')!
      const buttonMinus = calculator.buttons.value.find((b) => b.label === '-')!

      button5.action()
      buttonMinus.action()
      expect(calculator.display.value).toBe('5-')
    })

    it('乗算演算子が入力できること', () => {
      const button5 = calculator.buttons.value.find((b) => b.label === '5')!
      const buttonMultiply = calculator.buttons.value.find(
        (b) => b.label === '×'
      )!

      button5.action()
      buttonMultiply.action()
      expect(calculator.display.value).toBe('5×')
    })

    it('除算演算子が入力できること', () => {
      const button5 = calculator.buttons.value.find((b) => b.label === '5')!
      const buttonDivide = calculator.buttons.value.find(
        (b) => b.label === '÷'
      )!

      button5.action()
      buttonDivide.action()
      expect(calculator.display.value).toBe('5÷')
    })

    it('連続する演算子が入力されないこと', () => {
      const button5 = calculator.buttons.value.find((b) => b.label === '5')!
      const buttonPlus = calculator.buttons.value.find((b) => b.label === '+')!
      const buttonMinus = calculator.buttons.value.find((b) => b.label === '-')!

      button5.action()
      buttonPlus.action()
      buttonMinus.action()
      expect(calculator.display.value).toBe('5+')
    })
  })

  describe('計算実行', () => {
    it('簡単な加算が実行できること', () => {
      const button5 = calculator.buttons.value.find((b) => b.label === '5')!
      const buttonPlus = calculator.buttons.value.find((b) => b.label === '+')!
      const button3 = calculator.buttons.value.find((b) => b.label === '3')!
      const buttonEquals = calculator.buttons.value.find(
        (b) => b.label === '='
      )!

      button5.action()
      buttonPlus.action()
      button3.action()
      buttonEquals.action()
      expect(calculator.display.value).toBe('8')
    })

    it('簡単な減算が実行できること', () => {
      const button8 = calculator.buttons.value.find((b) => b.label === '8')!
      const buttonMinus = calculator.buttons.value.find((b) => b.label === '-')!
      const button3 = calculator.buttons.value.find((b) => b.label === '3')!
      const buttonEquals = calculator.buttons.value.find(
        (b) => b.label === '='
      )!

      button8.action()
      buttonMinus.action()
      button3.action()
      buttonEquals.action()
      expect(calculator.display.value).toBe('5')
    })

    it('簡単な乗算が実行できること', () => {
      const button6 = calculator.buttons.value.find((b) => b.label === '6')!
      const buttonMultiply = calculator.buttons.value.find(
        (b) => b.label === '×'
      )!
      const button4 = calculator.buttons.value.find((b) => b.label === '4')!
      const buttonEquals = calculator.buttons.value.find(
        (b) => b.label === '='
      )!

      button6.action()
      buttonMultiply.action()
      button4.action()
      buttonEquals.action()
      expect(calculator.display.value).toBe('24')
    })

    it('簡単な除算が実行できること', () => {
      const button8 = calculator.buttons.value.find((b) => b.label === '8')!
      const buttonDivide = calculator.buttons.value.find(
        (b) => b.label === '÷'
      )!
      const button2 = calculator.buttons.value.find((b) => b.label === '2')!
      const buttonEquals = calculator.buttons.value.find(
        (b) => b.label === '='
      )!

      button8.action()
      buttonDivide.action()
      button2.action()
      buttonEquals.action()
      expect(calculator.display.value).toBe('4')
    })

    it('0除算がエラーにならずに0を返すこと', () => {
      const button5 = calculator.buttons.value.find((b) => b.label === '5')!
      const buttonDivide = calculator.buttons.value.find(
        (b) => b.label === '÷'
      )!
      const button0 = calculator.buttons.value.find((b) => b.label === '0')!
      const buttonEquals = calculator.buttons.value.find(
        (b) => b.label === '='
      )!

      button5.action()
      buttonDivide.action()
      button0.action()
      buttonEquals.action()
      expect(calculator.display.value).toBe('0')
    })

    it('複数の演算が左から右に実行されること', () => {
      const button2 = calculator.buttons.value.find((b) => b.label === '2')!
      const buttonPlus = calculator.buttons.value.find((b) => b.label === '+')!
      const button3 = calculator.buttons.value.find((b) => b.label === '3')!
      const buttonMultiply = calculator.buttons.value.find(
        (b) => b.label === '×'
      )!
      const button4 = calculator.buttons.value.find((b) => b.label === '4')!
      const buttonEquals = calculator.buttons.value.find(
        (b) => b.label === '='
      )!

      button2.action()
      buttonPlus.action()
      button3.action()
      buttonMultiply.action()
      button4.action()
      buttonEquals.action()
      expect(calculator.display.value).toBe('20')
    })
  })

  describe('クリア機能', () => {
    it('ACボタンで全てクリアされること', () => {
      const button5 = calculator.buttons.value.find((b) => b.label === '5')!
      const buttonPlus = calculator.buttons.value.find((b) => b.label === '+')!
      const button3 = calculator.buttons.value.find((b) => b.label === '3')!
      const buttonAC = calculator.buttons.value.find((b) => b.label === 'AC')!

      button5.action()
      buttonPlus.action()
      button3.action()
      buttonAC.action()
      expect(calculator.display.value).toBe('0')
    })
  })

  describe('正負切り替え', () => {
    it('正の数が負の数に変換されること', () => {
      const button5 = calculator.buttons.value.find((b) => b.label === '5')!
      const buttonToggleSign = calculator.buttons.value.find(
        (b) => b.label === '±'
      )!

      button5.action()
      buttonToggleSign.action()
      expect(calculator.display.value).toBe('-5')
    })

    it('負の数が正の数に変換されること', () => {
      const button5 = calculator.buttons.value.find((b) => b.label === '5')!
      const buttonToggleSign = calculator.buttons.value.find(
        (b) => b.label === '±'
      )!

      button5.action()
      buttonToggleSign.action()
      buttonToggleSign.action()
      expect(calculator.display.value).toBe('5')
    })

    it('0の正負切り替えが0であること', () => {
      const buttonToggleSign = calculator.buttons.value.find(
        (b) => b.label === '±'
      )!

      buttonToggleSign.action()
      expect(calculator.display.value).toBe('0')
    })
  })

  describe('パーセント計算', () => {
    it('100が1に変換されること', () => {
      const button1 = calculator.buttons.value.find((b) => b.label === '1')!
      const button0 = calculator.buttons.value.find((b) => b.label === '0')!
      const buttonPercent = calculator.buttons.value.find(
        (b) => b.label === '%'
      )!

      button1.action()
      button0.action()
      button0.action()
      buttonPercent.action()
      expect(calculator.display.value).toBe('1')
    })

    it('50が0.5に変換されること', () => {
      const button5 = calculator.buttons.value.find((b) => b.label === '5')!
      const button0 = calculator.buttons.value.find((b) => b.label === '0')!
      const buttonPercent = calculator.buttons.value.find(
        (b) => b.label === '%'
      )!

      button5.action()
      button0.action()
      buttonPercent.action()
      expect(calculator.display.value).toBe('0.5')
    })
  })

  describe('del機能', () => {
    it('ACボタンが数値入力後はdelボタンに変わること', () => {
      const button5 = calculator.buttons.value.find((b) => b.label === '5')!
      button5.action()
      const delButton = calculator.buttons.value.find((b) => b.label === 'del')!
      expect(delButton).toBeDefined()
    })

    it('delボタンで最後の文字が削除されること', () => {
      const button1 = calculator.buttons.value.find((b) => b.label === '1')!
      const button2 = calculator.buttons.value.find((b) => b.label === '2')!
      const button3 = calculator.buttons.value.find((b) => b.label === '3')!

      button1.action()
      button2.action()
      button3.action()
      expect(calculator.display.value).toBe('123')

      const delButton = calculator.buttons.value.find((b) => b.label === 'del')!
      delButton.action()
      expect(calculator.display.value).toBe('12')
    })

    it('1文字しかない場合は0にリセットされること', () => {
      const button5 = calculator.buttons.value.find((b) => b.label === '5')!
      button5.action()
      expect(calculator.display.value).toBe('5')

      const delButton = calculator.buttons.value.find((b) => b.label === 'del')!
      delButton.action()
      expect(calculator.display.value).toBe('0')
    })

    it('del後に初期状態に戻ること', () => {
      const button5 = calculator.buttons.value.find((b) => b.label === '5')!
      const buttonPlus = calculator.buttons.value.find((b) => b.label === '+')!
      const button3 = calculator.buttons.value.find((b) => b.label === '3')!

      button5.action()
      buttonPlus.action()
      button3.action()

      const delButton = calculator.buttons.value.find((b) => b.label === 'del')!
      delButton.action()
      expect(calculator.display.value).toBe('5+')
    })
  })

  describe('演算子の後の数値入力', () => {
    it('演算子の後に数値を入力できること', () => {
      const button5 = calculator.buttons.value.find((b) => b.label === '5')!
      const buttonPlus = calculator.buttons.value.find((b) => b.label === '+')!
      const button3 = calculator.buttons.value.find((b) => b.label === '3')!

      button5.action()
      buttonPlus.action()
      button3.action()
      expect(calculator.display.value).toBe('5+3')
    })

    it('演算子の後に複数桁の数値を入力できること', () => {
      const button2 = calculator.buttons.value.find((b) => b.label === '2')!
      const buttonMultiply = calculator.buttons.value.find((b) => b.label === '×')!
      const button1 = calculator.buttons.value.find((b) => b.label === '1')!
      const button5 = calculator.buttons.value.find((b) => b.label === '5')!

      button2.action()
      buttonMultiply.action()
      button1.action()
      button5.action()
      expect(calculator.display.value).toBe('2×15')
    })
  })

  describe('演算子末尾での計算防止', () => {
    it('演算子で終わる場合は計算されないこと', () => {
      const button5 = calculator.buttons.value.find((b) => b.label === '5')!
      const buttonPlus = calculator.buttons.value.find((b) => b.label === '+')!
      const buttonEquals = calculator.buttons.value.find((b) => b.label === '=')!

      button5.action()
      buttonPlus.action()
      buttonEquals.action()
      expect(calculator.display.value).toBe('5+')
    })
  })

  describe('表示フォーマット', () => {
    it('長い数値が指数表記になること', () => {
      // 大きな数値を作成するため、999999999999 * 999999999999を計算
      const button9 = calculator.buttons.value.find((b) => b.label === '9')!
      const buttonMultiply = calculator.buttons.value.find(
        (b) => b.label === '×'
      )!
      const buttonEquals = calculator.buttons.value.find(
        (b) => b.label === '='
      )!

      // 999999999999を入力
      for (let i = 0; i < 12; i++) {
        button9.action()
      }
      buttonMultiply.action()
      // もう一度999999999999を入力
      for (let i = 0; i < 12; i++) {
        button9.action()
      }
      buttonEquals.action()

      // 結果が指数表記になることを確認
      expect(calculator.display.value).toContain('e+')
    })
  })
})
