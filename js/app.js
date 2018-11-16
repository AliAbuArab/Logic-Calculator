let app = new Vue({
  el: "#app",
  data: {
    title: "Logical Calculator",
    greeting: "Welcome to Telhai's Logical Calculator",
    verse: ""
  },
  watch: {
    verse() {
      this.isBalanced();
    }
  },
  methods: {
    isBalanced() {
      if (this.verse === null) console.log("Balanced");
      let expression = this.verse.split("");
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
    },
    addSymbol(e) {
      const pos = this.$refs.input.selectionStart; // get the pos of cursor
      const newSymbol = e.srcElement.innerText; // get the new symbol that entered
      const strBeforeCursor = this.verse.slice(0, pos);
      const strAfterCursor = this.verse.slice(pos);
      this.verse = strBeforeCursor + newSymbol + strAfterCursor; // update the verse 
      const el = document.getElementById("input");
      el.value = this.verse;
      el.setSelectionRange(pos+1, pos+1);
    }
  }
});
