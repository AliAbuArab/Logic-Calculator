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
const isCharValid = character => character.match(/^[a-z]+$/i) || this.symbols.indexOf(character) > -1;

// update the global verse variable when input change
const updateVerse = e => verse = e.value;

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

// add symbol to verse from buttons group
const addSymbol = e => {
  e = e.srcElement;
  const pos = input.selectionStart; // get the pos of cursor
  const newSymbol = e.innerText; // get the new symbol that entered
  const strBeforeCursor = verse.slice(0, pos);
  const strAfterCursor = verse.slice(pos);
  verse = strBeforeCursor + newSymbol + strAfterCursor; // update the verse 
  input.value = verse;
  input.setSelectionRange(pos+1, pos+1);
}

// add buttons dynamically 
symbols.forEach(symbol => {
  let button = document.createElement("button");
  button.type = "button" 
  button.className = "btn btn-light";
  button.addEventListener("click", addSymbol.bind(this), false);
  button.innerText = symbol;
  symbolButtons.appendChild(button);
});


//   watch: {
//     verse() {
//       const pos = this.$refs.input.selectionStart - 1; // get the pos of cursor
//       const newChar = this.verse.charAt(pos);
//       // check if the new character is valid
//       if (!this.isCharValid(newChar)) {
//         txtinput.value = this.verse;
//         txtinput.setSelectionRange(pos+1, pos+1);
//       }
//       //this.isBalanced();
//     }
//   }
// });
