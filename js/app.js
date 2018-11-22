// -----------------------------------------------------
// Global variables
// -----------------------------------------------------
const parentheses = ['(', ')'];
const symbols = ['¬', '→', '∧', '∨'];
const concludeSymbols = ['⊢', '⊨'];
const input = document.getElementById("input");
const errorMsg = document.getElementById("error");
let verse = "";



// -----------------------------------------------------
// Functions
// -----------------------------------------------------

// check if character is symbol
const isSymbol = character => this.symbols.includes(character);

// check if character is a letter
const isLetter = character => character.match(/^[a-zA-Z]+$/i);

// show error message
const showErrMsg = () => errorMsg.style.display = "block";

// hide error message
const hideErrMsg = () => errorMsg.style.display = "none";

// alert error message
const error = msg => {
  showErrMsg();
  errorMsg.innerText = msg;
}

// check if the character is valid
const isCharValid = character => character.match(/^[a-zA-Z0-9]+$/i) 
  || parentheses.includes(character) 
  || symbols.includes(character) 
  || concludeSymbols.includes(character);

// add symbol to verse from buttons group
const addSymbol = e => {
  const symbol = e.srcElement.innerText;  // get the new symbol that entered
  const pos = input.selectionStart; // get the pos of cursor
  let verse = input.value;
  const strBeforeCursor = verse.slice(0, pos);  // cut the verse before the cursor
  const strAfterCursor = verse.slice(pos);  // cut the verse after the cursor
  input.value = strBeforeCursor + symbol + strAfterCursor;
  input.setSelectionRange(pos+1, pos+1);  // move the cursor one step to the right
}

// initialize buttons group dynamically 
const symbolButtons = document.getElementById("symbolButtons");
// merge the three arrays to one
[...parentheses, ...symbols, ...concludeSymbols].forEach(symbol => {
  const button = document.createElement("button");
  button.type = "button" 
  button.className = "btn btn-light";
  button.addEventListener("click", addSymbol.bind(this), false);
  button.innerText = symbol;
  symbolButtons.appendChild(button);
});
// focus on input when load the page
input.focus();
// add event when click enter inside the input field
input.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) // check if enter is clicked
      document.getElementById("run-btn").click();
});

// check if parentheses i sbalanced
const isVerseValid = () => {
  try 
  {
    if (verse == null) return true;
    const expression = verse.split(""); // convert the string to array
    const allSymbols = [...symbols, ...concludeSymbols]; // merge the symbols array with concludeSymbols
    let stack = [];

    if ((symbols.includes(expression[0]) && expression[0] != '¬') 
      || (concludeSymbols.includes(expression[0]) && expression.length == 1) 
      || (symbols.includes(expression[expression.length-1]))) 
      throw "The verse shouldn't begin/end with symbol";

    for (let i = 0; i < expression.length; i++) 
    {
      if (!isCharValid(expression[i])) 
        throw "character is not valid";

      if (!isNaN(expression[i]) && (expression[i-1] == undefined || !isLetter(expression[i-1]))) 
        throw "there is an invalid variable";

      if (allSymbols.includes(expression[i]) 
        && allSymbols.includes(expression[i-1]) 
        && !(expression[i] == '¬' && expression[i-1] == '¬') 
        && !(concludeSymbols.includes(expression[i-1]) && expression[i] == '¬'))
        throw expression[i-1] + expression[i] + " not valid";
      
        // check if parentheses balanced
      if (parentheses.includes(expression[i])) {
        if (expression[i] == "(") {
          stack.push(expression[i]);
        } else {
          if (stack.length == 0) throw "Parentheses not balanced";
          stack.pop();
        }
      }
    }
    if (stack.length > 0) throw "Parentheses not balanced";
    hideErrMsg();
    return true;
  } 
  catch(e) {
    error(e);
    return false;
  }
}

//
const run = () => {
  verse = input.value;
  if (isVerseValid()) 
    console.log("Valid");
  else
    console.log("Not Valid"); 
}