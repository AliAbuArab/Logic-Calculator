// -----------------
// Global variables
// -----------------
const symbols = ['(', ')', '¬', '→', '∧', '∨', '⊢', '⊨'];
const symbolButtons = document.getElementById("symbolButtons");
const input = document.getElementById("input");
let verse = "";




// -----------------
// Functions
// -----------------

// check if character is symbol
const isSymbol = character => this.symbols.indexOf(character) > -1;

// check if the character is valid
const isCharValid = character => character.match(/^[a-z]+$/i) || symbols.indexOf(character) > -1;

// check if parentheses i sbalanced
const isBalanced = () => {
  if (verse === null) console.log("Balanced");
  let expression = verse.split("");
  let stack = [];
  for (let i = 0; i < expression.length; i++) {
    if (expression[i] == "(" || expression[i] == ")") {
      if (expression[i] == "(") {
        stack.push(expression[i]);
      } else {
        if (stack.length == 0) {
          console.log("Not Balanced");
          return;
        }
        let top = stack.pop();
        if (top == "(" && expression[i] !== ")")
          console.log("Not Balanced");
      }
    }
  }
  stack.length === 0 ? console.log("Balanced") : console.log("Not Balanced");
}

//
const addCharacterToVerse = (character, pos) => {
  // check if the new character is valid
  if (!isCharValid(character)) {
    verse = verse.slice(0, pos) + verse.slice(pos+1);
    input.value = verse;
    input.setSelectionRange(pos, pos); 
    return;
  }
  if (input.value == '') 
    verse = '';
  const strBeforeCursor = verse.slice(0, pos);
  const strAfterCursor = verse.slice(pos);
  verse = strBeforeCursor + character + strAfterCursor; // update the verse 
  input.value = verse;
  input.setSelectionRange(pos+1, pos+1);
  if (character == '(') {
    addCharacterToVerse(')', pos+1);
    input.setSelectionRange(pos+1, pos+1); 
  }
}

// add symbol to verse from buttons group
const addSymbol = e => {
  const symbol = e.srcElement.innerText; // get the new symbol that entered
  const pos = input.selectionStart; // get the pos of cursor
  addCharacterToVerse(symbol, pos);
}

// initialize buttons group dynamically 
symbols.forEach(symbol => {
  let button = document.createElement("button");
  button.type = "button" 
  button.className = "btn btn-light";
  button.addEventListener("click", addSymbol.bind(this), false);
  button.innerText = symbol;
  symbolButtons.appendChild(button);
});
// focus on input when load the page
input.focus();

// update the global verse variable when input change
  const updateVerse = e => {
  if (e.key == "Shift" || e.key == "ArrowLeft" || e.key == "ArrowRight") return;
  if (e.key == "Backspace") {
    verse = input.value;
    return;
  }
  const pos = input.selectionStart - 1; // get the pos of cursor
  if (pos == -1) {
    if (e.srcElement.value == '') 
      verse = '';
    return;
  }
  const newChar = e.srcElement.value.charAt(pos);
  addCharacterToVerse(newChar, pos);
  //isBalanced();
}