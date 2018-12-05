// ------------------------------------------------------------
// GLOBAL VARIABLES
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
const content = document.getElementById("content");
// -----------------------------------------------------------
// END OF GLOBAL VARIABLES
// -----------------------------------------------------------


// ------------------------------------------------------------
// CLASSES
// ------------------------------------------------------------
class OperandNode {
  // constructor
  constructor(operand) { 
    this.operand = operand;
  }

  // return T/F by search the value of operand in operandsMap
  calc(operandsMap) {
    return operandsMap.get(this.operand);
  }
}


class NotNode {
  // constructor
  constructor(underNode) { 
    this.underNode = underNode;
  }

  // return the negation of the calc result
  calc(operandsMap) {
    return !this.underNode.calc(operandsMap);
  }
}


class BinaryNode {
  //ImpliesNode | ORNode | ANDNode constructor
  constructor(operator, left, right) {
    this.operator = operator; 
    this.left = left;
    this.right = right;
  }

  // Return the result of calculation of OR | AND | Implies
  calc(operandsMap) {
    // AND operator
    if (this.operator == AND)
      return this.left.calc(operandsMap) && this.right.calc(operandsMap);
    // OR operator
    if (this.operator == OR)
      return this.left.calc(operandsMap) || this.right.calc(operandsMap);
    // Implies operator
    return !this.left.calc(operandsMap) || this.right.calc(operandsMap);
  }
}
// ------------------------------------------------------------
// END OF CLASSES
// ------------------------------------------------------------


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
| args:         None
| return:       None
| description:  Hide error message, set dispaly none of error div 
*/
const hideErrMsg = () => errorMsg.style.display = "none";


/*
| Function:     removeTruthTable
| args:         None
| return:       None
| description:  Remove the truth table from DOM if exist
*/
const removeTruthTable = () => {
  const table = document.getElementById("truthTable"); // Find the truth table if exists
  if (table) table.remove();  // If the table is already exists then remove it                              
}


/*
| Function:     error
| args:         msg
| return:       none
| description:  alert error message in red div above input field
*/
const error = msg => {
  showErrMsg();
  errorMsg.innerText = msg;
  removeTruthTable();
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
		node = new NotNode(node);
	}
	operands.unshift(node);
}


/*
| Function:     readFormula
| args:         formula
| return:       tree's root of operands and operators
| description:  First check if the formula is valid, if not will show error message if yes return tree of result
*/
const readFormula = formula => {
  if (formula == EOF) throw "The formula is empty";
  const operatorsStack = [];  // Operator stack for validation issue
  const operandsStack  = [];  // Operands stack that will useing later as tree
  const operandsSet = new Set();// Set of operands    
  let character = '';         // Instead of write formula[i]
  let expectOperand = true;   // Help us to check if operand is needed 
  let i = 0;                  // Index for loop over the formula
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
      operandsSet.add(operand);
      addOperand(new OperandNode(operand), operandsStack, operatorsStack);
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

  // if we got here that saying there's no problem therefore we hide the red error message div
  hideErrMsg();
  /*
  * Return array
  * [0] = The root of tree
  * [1] = List of operands
  */
  return [operandsStack[0], [...operandsSet]];
}


/*
| Function:     fillTruthTableRecursively
| args:         row, operandsList, treeRoot, tableBody
| return:       None
| description:  Fill the table's body
*/
const fillTruthTableRecursively = (i, operandsList, treeRoot, tableBody) => {
  // Iterate number of rows
  if (i == 2**operandsList.length) return;

  const operandsValueMap = new Map();           // Create new map for saving operand's value
  const row = document.createElement("tr");     // Create new column
  const binaryVal = i.toString(2);              // Convert from integer to binary
  let j = k = 0;  
  //
  while (j < operandsList.length - binaryVal.length) {
    const col = document.createElement("td");   // Create new column
    col.innerHTML = "F";                        // Set value of column to "F"
    row.appendChild(col);                       // Add new column in truth table
    operandsValueMap.set(operandsList[j], 0);   // Add the value (0) of operand to map
    j++;
  }
  //
  while (j < operandsList.length) {
    const col = document.createElement("td");                           // Create new column
    col.innerHTML = binaryVal.charAt(k) == "0" ? "F" : "T";             // Set value of column to "F"/"T"
    operandsValueMap.set(operandsList[j], Number(binaryVal.charAt(k))); // Add the value (0/1) of operand to map
    row.appendChild(col);                                               // Add new column in truth table
    j++;
    k++;
  }
  // Fill the last column of each row that have the result of assignement (T/F) in formula
  const col = document.createElement("td");
  col.innerHTML = treeRoot.calc(operandsValueMap) ? "T" : "F";
  row.appendChild(col);         // Add the result of calculation to the row
  tableBody.appendChild(row);   // Add the new result row to the table

  fillTruthTableRecursively(i+1, operandsList, treeRoot, tableBody);
}


/*
| Function:     createTruthTable
| args:         treeRoot, operandsList
| return:       None
| description:  Create the truth table
*/
const createTruthTable = (treeRoot, operandsList) => {
  removeTruthTable();                                     // Remove the last truth table
  const table = document.createElement("table");          // Create new HTML table element
  table.setAttribute("id", "truthTable");                 // Set id for the truth table
  table.className = "mx-auto table table-bordered mb-5";  // Add class attribute for styling
  const tableHeader = document.createElement("thead");    // Create table header HTML element
  const tableBody = document.createElement("tbody");      // Create table body HTML element
  const row = document.createElement("tr");               // Create table row HTML element for heading
  
  // Fill the first table's row for operands and formula
  for (let operand of operandsList) {
    const col = document.createElement("th");
    col.innerHTML = operand;
    row.appendChild(col);
  }

  // Add the formula to table's heading
  const lastCol = document.createElement("th");
  lastCol.innerHTML = treeToString(treeRoot);
  row.appendChild(lastCol);

  // Add the heading to the table
  tableHeader.appendChild(row);
  table.appendChild(tableHeader);

  // Fill the body of truth table
  fillTruthTableRecursively(0, operandsList, treeRoot, tableBody);
  
  table.appendChild(tableBody); // Add table's body for the table
  content.appendChild(table);   // Add the table to the HTML document
}


/*
| Function:     treeToString
| args:         node
| return:       string
| description:  return the hole formula as pretty string
*/
const treeToString = node => {
  // The node kind of OperandNode
  if (node instanceof OperandNode) return node.operand;
  // The node kind of NotNode
  else if (node instanceof NotNode) return "¬" + treeToString(node.underNode);
  // The node kind of BinaryNode
  else return "(" + treeToString(node.left) + " " + node.operator + " " + treeToString(node.right) + ")";
}


/*
| Function:     impFree
| args:         node
| return:       node
| description:  return the formula formatted to IMP_FREE style
*/
const impFree = node => {
  // The node kind of OperandNode
  if (node instanceof OperandNode) return node;
  // The node kind of NotNode
  else if (node instanceof NotNode) {
    node.underNode = impFree(node.underNode);
    return node;
  }
  // The node kind of BinaryNode
  else {
    if (node.operator == IMPLIES) {
      node.left = new NotNode(impFree(node.left));
      node.operator = OR;
    }
    else {
      node.left = impFree(node.left);
    }
    node.right = impFree(node.right);
    return node;
  }
}


/*
| Function:     nnf
| args:         node
| return:       node
| description:  return the formula formatted to NNF style
*/
const nnf = node => {
  // node is opernad
  if (node instanceof OperandNode) 
    return node;
  
  // node is binary
  else if (node instanceof BinaryNode) 
    return new BinaryNode(node.operator, nnf(node.left), nnf(node.right));
  
  // node is not
  else {
    if (node.underNode instanceof NotNode) 
      return nnf(node.underNode.underNode);

    else if (node.underNode instanceof BinaryNode) {
      // And node
      if (node.underNode.operator == AND)
        return nnf(new BinaryNode(OR, new NotNode(node.underNode.left), new NotNode(node.underNode.right)));
      
      // Or node
      else 
        return nnf(new BinaryNode(AND, new NotNode(node.underNode.left), new NotNode(node.underNode.right)));
    }
    else return node;
  }
}


/*
| Function:     cnf
| args:         node
| return:       node
| description:  return the formula formatted to CNF style
*/
const cnf = node => {

}


/*
| Function:     run
| args:         none
| return:       none
| description:  The main function that will run the program
*/
const run = () => {
  let formula = input.value;
  formula = formula.trim();         // Remove white spaces from begin/end of formula
  formula = formula.split("");      // Convert the string to array
  let leftSide = rightSide = null;
  const pos = formula.indexOf('⊢') == -1 ? formula.indexOf('⊨') == -1 ? -1 : formula.indexOf('⊨') : formula.indexOf('⊢');
  let firstTreeRoot = null;
  let firstTreeOperandsList = null;
  let secondTreeRoot = null;
  let secondTreeOperandsList = null;

  try {
    if (pos == -1) 
    {
      leftSide = formula.slice(0, formula.length);
      leftSide.push(EOF);
      [firstTreeRoot, firstTreeOperandsList] = readFormula(leftSide);
    } 
    else 
    {
      leftSide = formula.slice(0, pos);
      leftSide.push(EOF);
      rightSide = formula.slice(pos+1);
      rightSide.push(EOF);
      [firstTreeRoot, firstTreeOperandsList] = readFormula(leftSide); 
      [secondTreeRoot, secondTreeOperandsList] = readFormula(rightSide);
    }

    createTruthTable(firstTreeRoot, firstTreeOperandsList);
    firstTreeRoot = impFree(firstTreeRoot);
    firstTreeRoot = nnf(firstTreeRoot);
    console.log(treeToString(firstTreeRoot));
  }
  catch(e) 
  {
    error(e); // Show the error in red error message div
  }
}
// ------------------------------------------------------------
// END OF FUNCTIONS
// ------------------------------------------------------------


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