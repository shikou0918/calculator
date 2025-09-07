<script setup lang="ts">
import { useCalculator } from "../composables/useCalculator";

const { display, buttons } = useCalculator();
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
