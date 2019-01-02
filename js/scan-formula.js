//  -------------------------------------------------
// * Copyright by Salam Aslah & Ali Abu Arab (2018) *
//  -------------------------------------------------


/**
 * @description Add operator(e) to formula from buttons group
 * @param {Event} e 
 */
function addOperator(e) {
  const operator = e.srcElement.innerText;                  // Get the new operator that entered
  const pos = input.selectionStart;                         // Get the pos of cursor
  let formula = input.value;                                // Get the input text field
  const strBeforeCursor = formula.slice(0, pos);            // Cut the formula before the cursor
  const strAfterCursor = formula.slice(pos);                // Cut the formula after the cursor
  input.value = strBeforeCursor + operator + strAfterCursor;// Update the text on the text field
  if (operator == '⊣⊢')
    input.setSelectionRange(pos+2, pos+2);                   // Move the cursor two steps to the right
  else
    input.setSelectionRange(pos+1, pos+1);                   // Move the cursor one step to the right
  input.focus();                                            // Return the focus to the input text field
}
  

/**
 * @description Check if operand/variable started, need to start with a letter or underscore
 * @param {string[]} formula 
 * @param {number} index
 * @returns {(string | null)} return string | null
 */
function readOperand(formula, index) {
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


/**
 * @description Return priority of operator
 * @param {string} operator
 * @returns {0 | 1 | 2}
 */
function priorityOf(operator) {
  if (operator == IMPLIES) return 0;
  if (operator == OR) return 1;
  if (operator == AND) return 2;
}


/**
 * @description Adds a new operand to the operands stack, evaluating any '¬' that need to be performed first.
 * @param {object} node 
 * @param {[]} operands 
 * @param {[]} operators 
 */
function addNode(node, operands, operators) {
	while (operators.length > 0 && operators[0] == NOT) {
    operators.shift();    // pop from start of array
		node = new NotNode(node);
	}
	operands.unshift(node); // push to start of array
}


/**
 * @description First check if the formula is valid, if not will show error message if yes return tree of result
 * @param {[]} formula 
 * @returns {object} tree
 */
function readFormula(formula) {
  if (formula == EOF) throw "The formula is empty";
  const operatorsStack = [];    // Operator stack for validation issue
  const operandsStack  = [];    // Operands stack that will useing later as tree 
  let character = '';           // Instead of write formula[i]
  let expectOperand = true;     // Help us to check if operand is needed 
  let i = 0;                    // Index for loop over the formula
  // loop over the formula array
  while ((character = formula[i]) != EOF) 
  {
    // Check if there is another conclude operator (⊢, ⊨), shouldn't be another one
    if (concludeOperators.some(v => character === v)) throw "there is two conclude operator";
    
    // Check if character is valid 
    if (!isCharValid(character)) throw `${character} not valid character`;
    
    // Check if is operand/variable
    let operand = readOperand(formula, i);  // If is not operand will get null, otherwise we get the operand
    if (operand != null) {
      if (!expectOperand) throw "Expected →, ∧, ∨";
      // Add the operand to the tree
      let op;
      if (operand == "t" || operand == "T") op = new TrueNode;
      else if (operand == "f" || operand == "F") op = new FalseNode;
      else op = new OperandNode(operand);
      addNode(op, operandsStack, operatorsStack);
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
            || priorityOf(operatorsStack[0]) <= priorityOf(character)) 
            break;
          const operator = operatorsStack.shift();  // Pop the last operator from stack
          const right = operandsStack.shift();      // Pop the last operand from stack
          const left = operandsStack.shift();       // Pop the last operand from stack
          // Add the operand to the tree
          addNode(new BinaryNode(operator, left, right), operandsStack, operatorsStack);
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
          addNode(new BinaryNode(operator, left, right), operandsStack, operatorsStack);
        }
        const operand = operandsStack.shift();
        // Add the operand to the tree
        addNode(operand, operandsStack, operatorsStack);
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
  
      const operator = operatorsStack.shift();  // Pop the last operator from stack
      const right = operandsStack.shift();      // Pop the last operand from stack
      const left = operandsStack.shift();       // Pop the last operand from stack
      // Add the operand to the tree
      addNode(new BinaryNode(operator, left, right), operandsStack, operatorsStack);
    }
  }

  // If we got here that saying there's no problem therefore we hide the red error message div
  // And show the tabs section
  hideErrMsg();
  
  
  // Return the root of tree
  const tree = operandsStack[0];
  tree.updateOperandsList();
  return tree;
}