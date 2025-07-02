
const display = document.getElementById('display');
const degreeToggle = document.getElementById('degreeToggle');
const darkToggle = document.getElementById('darkModeToggle');
const historyList = document.getElementById('historyList');

let expression = '';

function appendValue(val, realVal = val) {
  display.value += val;
  expression += realVal;
}

function appendFunction(displaySymbol, evalFunction) {
  display.value += displaySymbol + '(';
  expression += (degreeToggle.checked && ['Math.sin','Math.cos','Math.tan'].includes(evalFunction))
    ? `degToRad(${evalFunction})(` 
    : evalFunction + '(';
}

function clearDisplay() {
  display.value = '';
  expression = '';
}

function deleteChar() {
  display.value = display.value.slice(0, -1);
  expression = expression.slice(0, -1);
}

function calculate() {
  try {
    // Auto-close missing parentheses
    const openParens = (expression.match(/\(/g) || []).length;
    const closeParens = (expression.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      expression += ')'.repeat(openParens - closeParens);
    }

    const result = eval(expression);
    display.value = result;
    addToHistory(display.value);
    expression = result.toString();
  } catch {
    display.value = 'Error';
    expression = '';
  }
}

function addToHistory(val) {
  const li = document.createElement('li');
  li.textContent = val;
  historyList.prepend(li);
  if (historyList.children.length > 5) {
    historyList.removeChild(historyList.lastChild);
  }
}

function degToRad(func) {
  return function(x) {
    return func(x * Math.PI / 180);
  };
}

// Handle dark mode toggle
darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark', darkToggle.checked);
});

// Handle keyboard input
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendValue(e.key);
  else if (['+', '-', '*', '/', '.', '(', ')', '%'].includes(e.key)) appendValue(e.key);
  else if (e.key === 'Enter') calculate();
  else if (e.key === 'Backspace') deleteChar();
});
