2/**
 *  
 * Copyright by Salam Aslah & Ali Abu Arab (2018)
*/ 

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
const TRUE = 'T';
const FALSE = 'F';
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
    return this.operand == TRUE ? true : this.operand == FALSE ? false : operandsMap.get(this.operand);
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
const isWhitespace = character => character.trim() === '';


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
| Function:     sort
| args:         str
| return:       string
| description:  Sorting string letters nn alphabetical order
*/
const sort = str => str.split('').sort().join('');


/*
| Function:     isSetsEquals
| args:         set1, set2
| return:       true/false
| description:  Check if sets is equals
*/
const isSetsEquals = (set1, set2) => {
  if (set1.size != set2.size) return false;
  for (let item of set1) if (!set2.has(item)) return false;
  return true;
}
/*
|Function: isSubSet
|args: set1,set2
|return true/false
|description: chaeck if one set has the other set 
*/
const isSubSet = (set1,set2) =>{
  if(set1.size>set2.size){
    for (let item of set2) if (!set1.has(item)) return false;
  return true;
  }
  else{
    for (let item of set1) if (!set2.has(item)) return false;
  return true;
  }
}
/*
|Function: FoundNot
|args: string item ,set
|return true/false
|description: chaeck is item is not of one elment in set 
*/
const FoundNot = (item , set)=>{
   for(let item2 of set){
      	if(item.substring(1,item.length+1) == item2) return true;
      	if(item2.substring(1,item2.length+1) == item) return true;
      }
    return false;
   }
/*
|Function: isSubSet
|args: set1,set2
|return true/false
|description: chaeck if is the same set only one elment the not of 
*/  
const isNotSubSet = (set1,set2) =>{
  let cnt=0;
  let flag = true;
  if (set1.size != set2.size) return false;
  for (let item of set2) {
    if (!set1.has(item)) {
        if(cnt > 0 || !FoundNot(item,set1)) return false;
           else if(FoundNot(item,set1))cnt++;
        }
    }
   return true;
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
  const operatorsStack = [];    // Operator stack for validation issue
  const operandsStack  = [];    // Operands stack that will useing later as tree
  const operandsSet = new Set();// Set of operands    
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
      if (operand == "t") operand = TRUE;
      else if (operand == "f") operand = FALSE;
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
            || priorityOf(operatorsStack[0]) <= priorityOf(character)) break;
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
  
  operandsSet.delete(TRUE);
  operandsSet.delete(FALSE);
  /**
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
| Function:     cdistr
| args:         nodeLeft, nodeRight
| return:       node
| description:  return the formula Distr formatted to CNF style
*/
const cnfDistr = (nodeLeft, nodeRight) => {
  let leftChild ,rightChild;
  if (nodeLeft instanceof BinaryNode && nodeLeft.operator== AND) {
    leftChild = new BinaryNode(OR,nodeLeft.left,nodeRight);
   	rightChild = new BinaryNode(OR,nodeLeft.right,nodeRight);
  }
  else {
    leftChild = new BinaryNode(OR,nodeLeft,nodeRight.left);
    rightChild = new BinaryNode(OR,nodeLeft,nodeRight.right);
  }
  return new BinaryNode(AND,leftChild,rightChild);
}


/*
| Function:     cnf
| args:         node
| return:       node
| description:  return the formula formatted to CNF style
*/
const cnf = node => {
  if (node instanceof OperandNode || node instanceof NotNode)
  	return node;
  
  if (node.operator == OR &&(node.left.operator == AND || node.right.operator == AND))
  	node = cnfDistr(node.left, node.right);
  
  node.left = cnf(node.left);
  node.right =cnf(node.right);
  
  if (node.operator == OR &&(node.left.operator == AND || node.right.operator == AND))
  	node = cnfDistr(node.left, node.right);
  return node;
}


/*
| Function:     dnfDistr
| args:         nodeLeft, nodeRight
| return:       node
| description:  return the formula Distr formatted to DNF style
*/
const dnfDistr = (nodeLeft, nodeRight) =>{
  let leftChild ,rightChild;
  if (nodeLeft instanceof BinaryNode && nodeLeft.operator == OR) {
   	leftChild = new BinaryNode(AND, nodeLeft.left, nodeRight);
   	rightChild = new BinaryNode(AND, nodeLeft.right, nodeRight);
  }
  else {
   	leftChild = new BinaryNode(AND, nodeLeft, nodeRight.left);
   	rightChild = new BinaryNode(AND, nodeLeft, nodeRight.right);
  }
  return new BinaryNode(OR, leftChild, rightChild);
}


/*
| Function:     dnf
| args:         node
| return:       node
| description:  return the formula formatted to DNF style
*/
const dnf = node => {
  if (node instanceof OperandNode || node instanceof NotNode)
  	return node;
  
  if (node.operator == AND && (node.left.operator == OR || node.right.operator == OR))
  	node = ddistr(node.left, node.right);
  
  node.left = dnf(node.left);
  node.right = dnf(node.right);
  
  if (node.operator == AND && (node.left.operator == OR || node.right.operator == OR))
  	node = ddistr(node.left, node.right);
  
  return node;
}


/*
| Function : OrSimp
| args : node 
| return : node
| description: simplify OR formula in tree
*/
const OrSimp = (nodeLeft,nodeRight) =>{
	let lstring = treeToString(nodeLeft);
  let rstring = treeToString(nodeRight);
  let llength=lstring.length;
  let rlength=rstring.length;
 
  if(llength<rlength){
    
  }

  if((nodeLeft instanceof OperandNode && nodeLeft.operand=="T")||(nodeRight instanceof OperandNode && nodeRight.operand=="T"))
		return new OperandNode("T");
  if(treeToString(nodeLeft) === treeToString(nodeRight))
    return nodeLeft;
  if(nodeLeft instanceof NotNode){
    if(treeToString(nodeLeft.underNode) === treeToString(nodeRight))
      return new OperandNode("T");
  }
  if(nodeRight instanceof NotNode){
    if(treeToString(nodeLeft) === treeToString(nodeRight.underNode))
      return new OperandNode("T");
  }
}


/*
| Function : OrSimp
| args : node 
| return : node
| description: simplify OR formula in tree
*/
const AndSimp = (nodeLeft,nodeRight) =>{
  if((nodeLeft instanceof OperandNode && nodeLeft.operand=="T"))
    return nodeRight;
  if(nodeRight instanceof OperandNode && nodeRight.operand=="T")
    return nodeLeft;
  if(treeToString(nodeLeft) === treeToString(nodeRight))
    return nodeLeft;
  if(nodeLeft instanceof NotNode){
    if(treeToString(nodeLeft.underNode) === treeToString(nodeRight))
      return new OperandNode("F");
  }
  if(nodeRight instanceof NotNode){
    if(treeToString(nodeLeft) === treeToString(nodeRight.underNode))
      return new OperandNode("F");
  }
}





/*
| Function:    removeDuplicates
| args:        node, set ,flag
| return:      node
| description: Remove duplicates node
*/
const removeDuplicates = (node, upOperator, set,flag) => {
  // We are standing on operand node
  if (node instanceof OperandNode) {
    // The node before was not
    if (upOperator == NOT) {
      if (set.has(NOT + node.operand)) return null;
      set.add(NOT + node.operand);
    }
    // The node before wasn't not
    else if (upOperator != NOT) {
      if(set.has(node.operand)) return null;
      set.add(node.operand);
    }
  }

  // We are standing on binary node
  else if (node instanceof BinaryNode) {
    let leftSet;
    // We are standing on or node
    
    node.left = removeDuplicates(node.left, node.operator, set,flag);
    leftSet = new Set(set);
    if(!flag){
      if (node.operator == AND) {
       set.clear();
       }
    } else {
        if (node.operator == OR) {
          set.clear();
        }
    }

    // If operator is ∧ we have to reset the set of operands
    node.right = removeDuplicates(node.right, node.operator, set,flag);
     
     //Simplfy Cases
     //1.(q OR p)AND(r OR s)
    if(node.operator == AND && 
    	((node.left instanceof BinaryNode && node.left.operator == OR)||
    		(node.right instanceof BinaryNode && node.right.operator == OR))){

      if(isSubSet(leftSet, set))//1.1 if the one side has the other side return it 
       return leftSet.size > set.size ? node.right : node.left ;
       
       //1.2 if one diffrence that one of them has the not of other: (¬p OR q)AND(p OR q)= q
       if(isNotSubSet(leftSet, set)){ 
       	// check witch node has a not 
        if(node.left.right instanceof NotNode)
           return node.left.left;
        else if(node.left.left instanceof NotNode)
             return node.left.right;
        else if(node.right.left instanceof NotNode)
              return node.right.right;
        else return node.right.left;
      }
      //1.3 this case is : (¬p OR q) AND p = p AND q
      else if(node.left instanceof BinaryNode && node.left.operator == OR ){
      	//check wich side is the not 
        if(node.left.left instanceof NotNode && treeToString(node.left.left.underNode) == treeToString(node.right))
        return new BinaryNode(AND,node.left.right,node.right);
      
        if(node.left.right instanceof NotNode&&treeToString(node.left.right.underNode) == treeToString(node.right))
        return new BinaryNode(AND,node.left.left,node.right);
              
      }
      else 
         {//check wich side is the not 
          if(node.right.left instanceof NotNode && treeToString(node.right.left.underNode) == treeToString(node.left))
            return new BinaryNode(AND,node.right.right,node.left);
        
          if(node.right.right instanceof NotNode &&treeToString(node.right.right.underNode) == treeToString(node.left))
          return new BinaryNode(AND,node.right.left,node.left);
         }
    }
    //2. (p AND q) OR (r AND s)
    if(node.operator == OR && 
    	((node.left instanceof BinaryNode && node.left.operator == AND)||
    		(node.right instanceof BinaryNode && node.right.operator == AND))){
       if(isSubSet(leftSet, set)){//2.1 if one side has the other side return it
         return leftSet.size > set.size ? node.right : node.left ;
         }
      
       //2.2 (¬p AND q) OR p = q OR p
       else if(node.left instanceof BinaryNode && node.left.operator == AND ){// found a NOt node
        if(node.left.left instanceof NotNode && treeToString(node.left.left.underNode) == treeToString(node.right))
        return new BinaryNode(OR,node.left.right,node.right);
      
        if(node.left.right instanceof NotNode&&treeToString(node.left.right.underNode) == treeToString(node.right))
        return new BinaryNode(OR,node.left.left,node.right);
              
      }
      else // found a NOt node
         {
          if(node.right.left instanceof NotNode && treeToString(node.right.left.underNode) == treeToString(node.left))
            return new BinaryNode(AND,node.right.right,node.left);
        
          if(node.right.right instanceof NotNode &&treeToString(node.right.right.underNode) == treeToString(node.left))
          return new BinaryNode(AND,node.right.left,node.left);
         }
    }
    //3. p OR q OR s OR t
    if(node.operator == OR && 
    	((node.left instanceof BinaryNode && node.left.operator == OR)||
    		(node.right instanceof BinaryNode && node.right.operator == OR))){
      //3.1 ¬p OR q OR p = T 
      if(node.left instanceof BinaryNode && node.left.operator == OR ){//found it 
        if(node.left.left instanceof NotNode && treeToString(node.left.left.underNode) == treeToString(node.right))
        return new OperandNode(TRUE);
      
        if(node.left.right instanceof NotNode&&treeToString(node.left.right.underNode) == treeToString(node.right))
        return new OperandNode(TRUE);
              
      }
      else //found it 
         {
          if(node.right.left instanceof NotNode && treeToString(node.right.left.underNode) == treeToString(node.left))
          return new OperandNode(TRUE);
        
          if(node.right.right instanceof NotNode &&treeToString(node.right.right.underNode) == treeToString(node.left))
          return new OperandNode(TRUE);
         }
    }

     // 4. if the left side is the same at the right side return one of them : q AND q , q OR q = q
    if (isSetsEquals(leftSet, set)) return node.left;
    
    //5. the left side are not the right side 
    if(node.left instanceof NotNode && !(node.right instanceof NotNode)){//5.1 ¬Q OR Q = T, ¬Q AND Q = F
      if(treeToString(node.left.underNode) == treeToString(node.right)){
        if(node.operator == OR)
          return new OperandNode(TRUE);
        else
          return new OperandNode(FALSE);
      }
    }

    if(!(node.left instanceof NotNode) && node.right instanceof NotNode){//5.2  Q OR ¬Q = T, Q AND ¬Q = F
      if(treeToString(node.left) == treeToString(node.right.underNode)){
        if(node.operator == OR)
          return new OperandNode(TRUE);
        else
          return new OperandNode(FALSE);
      }
    }
    
    if (node.left == null) return node.right;
    else if (node.right == null) return node.left;
   
    //6. if one of them false or true and the operator is OR 
    if (node.operator == OR) {
      if ((node.left instanceof OperandNode && node.left.operand == TRUE) || 
      	(node.right instanceof OperandNode && node.right.operand == TRUE))//T OR q , q OR T =T
        return new OperandNode(TRUE);
      if(node.left instanceof OperandNode && node.left.operand == FALSE)//F OR q = q
         return node.right; 
      if(node.right instanceof OperandNode && node.right.operand == FALSE)//q OR F = q
         return node.left; 
    }
    // We are standing on ∧ node
    //7. if one of them false or true
    else {
      if ((node.left instanceof OperandNode && node.left.operand == FALSE) || 
      	(node.right instanceof OperandNode && node.right.operand == FALSE))// F AND q = F
        return new OperandNode(FALSE);
      if(node.left instanceof OperandNode && node.left.operand == TRUE) // T AND q = q
         return node.right; 
      if(node.right instanceof OperandNode && node.right.operand == TRUE)
         return node.left; 
    }
  }

  // We are standing on not node
  else {
    node.underNode = removeDuplicates(node.underNode, NOT, set,flag);
    if (node.underNode == null) return null;
  }
  return node;
}


/*
| Function:    simplify
| args:        node 
| return:      node
| description: Simplify formula tree
*/
const simplify = node => {
  /** 
   *  First of all to simplify a formula we have to change her style to more simple formula
   *  so we choosed to change it to CNF style
  */
  let strc,strd;
  node = impFree(node);
  node = nnf(node);
  let node2 = node; 

  node2 = cnf(node2);//simplify cnf 
  strc = treeToString(node2) + " = ";
  node2 = removeDuplicates(node2, null, new Set(),false);
  strc+=treeToString(node2);

  node2 = node;
  node2 = dnf(node2);//simplify dnf 
  strd = treeToString(node2) + " = ";
  node2 = removeDuplicates(node2, null, new Set(),true);
  strd+=treeToString(node2);
  return {strc,strd};
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
    //firstTreeRoot = impFree(firstTreeRoot);
    //firstTreeRoot = nnf(firstTreeRoot);
    //firstTreeRoot = cnf(firstTreeRoot);
    const ret = simplify(firstTreeRoot);
    const cnftext = document.getElementById("cnftext");
    cnftext.value = ret.strc;
    const dnftext = document.getElementById("dnftext");
    dnftext.value = ret.strd;
    //console.log(firstTreeRoot);
    //console.log(treeToString(firstTreeRoot));
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