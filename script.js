const numBtn = document.querySelectorAll(".num");
const delBtn = document.querySelector(".del");
const acBtn = document.querySelector(".ac");
const opBtn = document.querySelectorAll(".op");
const eqBtn = document.querySelector(".eq");
const displayText = document.querySelector(".output")

numBtn.forEach(button => {
  button.addEventListener("click", function(event) {
    displayText.textContent += event.target.value;
    const value = event.target.value;
    infix.push(value);
  });
});

delBtn.addEventListener("click", function(event) {
    const currentText = displayText.textContent;

    displayText.textContent = currentText.slice(0, -1);
})

acBtn.addEventListener("click", function(event) {
    displayText.textContent = "";
});

opBtn.forEach(button => {
  button.addEventListener("click", function(event) {
    displayText.textContent += event.target.value;
    const value = event.target.value;
    infix.push(value);
  });
});

eqBtn.addEventListener("click", function(event) {
    const postfix = makePostfixArray(infix);
    const result = evaluatePostfix(postfix);
    displayText.textContent = result;

    infix = [result.toString()];
});


//algorithm to calculate value
let infix = [];

function makePostfixArray(infixArray) {
  const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 3 
  };

  const isRightAssociative = {
    '^': true
  };

  const outputQueue = [];
  const operatorStack = [];

  const isOperator = (token) => ['+', '-', '*', '/', '^'].includes(token);

  for (const token of infixArray) {
    if (!isNaN(token)) {
      outputQueue.push(token);
    }
    else if (token === '(') {
      operatorStack.push(token);
    } 
    else if (token === ')') {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
        outputQueue.push(operatorStack.pop());
      }
      operatorStack.pop(); // Discard the '('
    } 
    else if (isOperator(token)) {
      const o1 = token;
      
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
        const o2 = operatorStack[operatorStack.length - 1];
        
        if (
          precedence[o2] > precedence[o1] || 
          (precedence[o2] === precedence[o1] && !isRightAssociative[o1])
        ) {
          outputQueue.push(operatorStack.pop());
        } else {
          break;
        }
      }
      operatorStack.push(o1);
    }
  }

  while (operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop());
  }

  return outputQueue;
}



function evaluatePostfix(postfixArray) {
  const stack = [];

  for (const token of postfixArray) {
    // 1. If it's a number, convert it from a string and push to the stack
    if (!isNaN(token)) {
      stack.push(parseFloat(token));
    } 
    // 2. If it's an operator, pop the last two numbers and calculate
    else {
      // Order matters! The first popped is the right operand, second is left.
      const b = stack.pop(); // Right operand
      const a = stack.pop(); // Left operand

      switch (token) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          stack.push(a / b);
          break;
        case '^':
          stack.push(Math.pow(a, b));
          break;
        default:
          throw new Error(`Unknown operator: ${token}`);
      }
    }
  }

  // 3. The final remaining number in the stack is your answer
  return stack.pop();
}

