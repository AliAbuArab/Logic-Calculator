// ------------------------------------------------------------
// Global variables
// ------------------------------------------------------------
const EOF = '$';  // End of formula
const OPEN_PARENTHESES = '(';
const CLOSE_PARENTHESES = ')';
const parentheses = [OPEN_PARENTHESES, CLOSE_PARENTHESES];
const NOT = '¬';
const IMPLIES = '→';
const AND = '∧';
const OR = '∨'
const operators = [NOT, IMPLIES, AND, OR];
const concludeOperators = ['⊢', '⊨'];
const INPUT = document.getElementById("input");
const errorMsg = document.getElementById("error");
const operatorButtons = document.getElementById("operatorButtons");
// ------------------------------------------------------------
// Classes
// ------------------------------------------------------------
class UnaryNode {
  // Not Node
  constructor(operand) { 
    this.operand = operand;
  }
}
class BinaryNode {
  //ImpliesNode | ORNode | ANDNode
  constructor(operator, left, right) {
    this.operator = operator; 
    this.left = left;
    this.right = right;
  }
}
// ------------------------------------------------------------
// Functions
// ------------------------------------------------------------
/*
| Function:     isWhitespace
| args:         character
| return:       true | false
| description:  check if character is whitespace
*/
const isWhitespace= character => character.trim() === '';


/*
| Function:     isOperator
| args:         character
| return:       true | false
| description:  check if character is operator (, ), ¬, →, ∧, ∨
*/
const isOperator = character => operators.includes(character);


/*
| Function:     isLetter
| args:         character
| return:       true | false
| description:  check if character is a letter like p,q,r,... or undescore '_'
*/
const isLetter = character => character.match(/[A-Za-z_]/);


/*
| Function:     showErrMsg
| args:         none
| return:       none
| description:  show error message, set dispaly block of error div 
*/
const showErrMsg = () => errorMsg.style.display = "block";


/*
| Function:     hideErrMsg
| args:         none
| return:       none
| description:  hide error message, set dispaly none of error div 
*/
const hideErrMsg = () => errorMsg.style.display = "none";


/*
| Function:     error
| args:         msg
| return:       none
| description:  alert error message in red div above input field
*/
const error = msg => {
  showErrMsg();
  errorMsg.innerText = msg;
}


/*
| Function:     isCharValid
| args:         character
| return:       true | false
| description:  check if the character is valid, [numbers, letters, whitespace]
*/
const isCharValid = character => character.match(/^[a-zA-Z0-9\s]+$/i) 
  || parentheses.includes(character) 
  || operators.includes(character) 
  || concludeOperators.includes(character);


/*
| Function:     addOperator
| args:         e
| return:       none
| description:  add operator(e) to formula from buttons group
*/
const addOperator = e => {
  const operator = e.srcElement.innerText;  // get the new operator that entered
  const pos = input.selectionStart; // get the pos of cursor
  let formula = input.value;
  const strBeforeCursor = formula.slice(0, pos);  // cut the formula before the cursor
  const strAfterCursor = formula.slice(pos);  // cut the formula after the cursor
  input.value = strBeforeCursor + operator + strAfterCursor;
  input.setSelectionRange(pos+1, pos+1);  // move the cursor one step to the right
}


/*
| Function:     readOperand
| args:         formula, index
| return:       variable name | null
| description:  Check if operand/variable started, need to start with a letter or underscore
*/
const readOperand = (formula, index) => {
  if (isLetter(formula[index])) {
    let operand = formula[index];
    index++;
    while (/[A-Za-z_0-9]/.test(formula[index])) {
      operand += formula[index];
      index++;	
    }
   return operand;
  }
  return null;
}


/*
| Function:     priorityOf
| args:         operator
| return:       0 | 1 | 2
| description:  return priority of operator
*/
const priorityOf = operator => {
  if (operator == IMPLIES) return 0;
  if (operator == OR) return 1;
  if (operator == AND) return 2;
}


/*
| Function:     addOperand
| args:         node, operandsStack, operatorsStack
| return:       0 | 1 | 2
| description:  Adds a new operand to the operands stack, evaluating any '¬' that need to be performed first.
*/
const addOperand = (node, operands, operators) => {
	while (operators.length > 0 && operators[0] == NOT) {
    operators.shift();
		node = new UnaryNode(node);
	}
	operands.unshift(node);
}


/*
| Function:     readFormula
| args:         formula
| return:       tree of operands and operators
| description:  First check if the formula is valid, if not will show error message if yes return tree of result
*/
const readFormula = formula => {
  try {
    if (formula == EOF) throw "The formula is empty";
    const operatorsStack = [];  // operator stack for validation issue
	  const operandsStack  = [];  // operands stack that will useing later as tree     
    let character = '';         // instead of write formula[i]
    let expectOperand = true;   // help us to check if operand is needed 
    let i = 0;                  // index for loop over the formula
    // loop over the formula array
    while ((character = formula[i]) != EOF) 
    {
      // Check if there is another conclude operator (⊢, ⊨), shouldn't be another one
      if (concludeOperators.some(v => character === v)) throw "there is two conclude operator";
      
      // Check if character is valid 
      if (!isCharValid(character)) throw `${character} not valid character`;
      
      // Check if is operand/variable
      const operand = readOperand(formula, i);  // If is not operand will get null, otherwise we get the operand
      if (operand != null) {
        if (!expectOperand) throw "Expected →, ∧, ∨";
        // Add the operand to the tree
        addOperand(new UnaryNode(operand), operandsStack, operatorsStack);
        expectOperand = false;  // Now we expect operator or parentheses
        i += operand.length;    // Skip the opernad to the next token
        continue;
      }

      // Check if is operator ¬, →, ∧, ∨
      else if (isOperator(character)) {
        //
        if (character == NOT && expectOperand) operatorsStack.unshift(character); // push to start of array
        //
        else if (character == NOT && !expectOperand) throw "Expected →, ∧, ∨";
        //
        else if (expectOperand) throw "Expected operand";
        //
        else if (character != NOT) {
				  while (true) {
            if (operatorsStack.length == 0
              || operatorsStack[0] == OPEN_PARENTHESES
              || priorityOf(operatorsStack[0] <= priorityOf(character))) break;
            const operator = operatorsStack.shift();
            const right = operandsStack.shift();
            const left = operandsStack.shift();
            // Add the operand to the tree
            addOperand(new BinaryNode(operator, left, right), operandsStack, operatorsStack);
          }
          operatorsStack.unshift(character); // push to start of array
          expectOperand = true; // Now we're expecting an operand after →, ∧, ∨.
        }
      }

      // Check if is parentheses (, )
      else if (parentheses.includes(character)) {
        //
        if (character == OPEN_PARENTHESES && expectOperand) 
          operatorsStack.unshift(character); // push to start of array
        //
        else if (character == OPEN_PARENTHESES && !expectOperand)
          throw "Expecting close parenthesis";
        //
        else if (character == CLOSE_PARENTHESES && expectOperand)
          throw "Expecting an operand or open parenthesis";
        //
        else if (!expectOperand) {
          while (true) {
            if (operatorsStack.length == 0) 
              throw "This close parenthesis doesn't match any open parenthesis";
            //
            const operator = operatorsStack.shift(); // pop from start of array
            if (operator == OPEN_PARENTHESES) break;  
            
            // Otherwise, if the top of the stack is a '¬', we have a syntax error
            if (operator == NOT) throw "Nothing is negated by this operator";
            //
            const right = operandsStack.shift(); // pop from start of array
            const left = operandsStack.shift(); // pop from start of array
            // Add the operand to the tree
            addOperand(new BinaryNode(operator, left, right), operandsStack, operatorsStack);
          }
          const operand = operandsStack.shift();
          // Add the operand to the tree
          addOperand(operand, operandsStack, operatorsStack);
        }
      }
      // Check if it not whitespaces
      else if (!isWhitespace(character)) throw "The character " + character + " shouldn't be here";
      i++; // Increment any away to the next character of formula
    }
    
    if (operatorsStack.length > 0) {
      if (expectOperand) throw "Missing an operand or close parenthesis";
      while (true) {
        if (operatorsStack.length == 0 || operatorsStack[0] == CLOSE_PARENTHESES) break;
        if (operatorsStack[0] == OPEN_PARENTHESES) throw "open parenthesis has no matching close parenthesis";
        const operator = operatorsStack.shift(); // Pop the last operator from stack
        const right = operandsStack.shift(); // Pop the last operand from stack
        const left = operandsStack.shift(); // Pop the last operand from stack
        addOperand(new BinaryNode(operator, left, right), operandsStack, operatorsStack); // Add the operand to the tree
      }
    }
    console.log(operandsStack);
    // if we got here that saying there's no problem therefore we hide the red error message div
    hideErrMsg();
    return true;
  } 
  catch(e) {
    error(e); // Show the error in red error message div
    return false;
  }
}


/*
| Function:     run
| args:         none
| return:       none
| description:  The main function that will run the program
*/
const run = () => {
  let formula = input.value;
  formula = formula.trim(); // remove white spaces from begin/end of formula
  formula = formula.split(""); // Convert the string to array
  let valid = true;
  let leftSide = rightSide = null;
  const pos = formula.indexOf('⊢') == -1 ? formula.indexOf('⊨') == -1 ? -1 : formula.indexOf('⊨') : formula.indexOf('⊢');

  if (pos == -1) {
    leftSide = formula.slice(0, formula.length);
    leftSide.push(EOF);
    valid = readFormula(leftSide);
  } else {
    leftSide = formula.slice(0, pos);
    leftSide.push(EOF);
    rightSide = formula.slice(pos+1);
    rightSide.push(EOF);
    valid = readFormula(leftSide) && readFormula(rightSide);
  }
  
  if (valid) 
    console.log("Valid");
  else 
    console.log("Not Valid"); 
}


// -----------------------------------------------------
// Initialize System
// -----------------------------------------------------

// Initialize buttons group dynamically 
// Merge the three arrays to one
[...parentheses, ...operators, ...concludeOperators].forEach(operator => {
  // Create new HTML Element button
  const button = document.createElement("button");
  // Add tybe to button 
  button.type = "button";
  // Add class to the button
  button.className = "btn btn-light";
  // Add onClick listener, the addOperator function will handle event and pass to this object
  button.addEventListener("click", addOperator.bind(this), false);
  // The text will show on the button
  button.innerText = operator;
  // Add the button to the HTML file
  operatorButtons.appendChild(button);
});
// Focus on input when load the page
input.focus();
// Add event when click enter inside the input field
input.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) // check if enter is clicked
      document.getElementById("run-btn").click();
});