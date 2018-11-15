let app = new Vue({
  el: "#app",
  data: {
    title: "Logical Calculator",
    greeting: "Welcome to Telhai's Logical Calculator",
    message: "Hello Vue!",
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
        if (expression[i] === "(" || expression[i] === ")") {
          if (expression[i] === "(") {
            stack.push(expression[i]);
          } else {
            if (stack.length === 0) {
              console.log("Not Balanced");
              return;
            }
            let top = stack.pop();
            if (top === "(" && expression[i] !== ")")
              console.log("Not Balanced");
          }
        }
      }
      stack.length === 0 ? console.log("Balanced") : console.log("Not Balanced");
    },
    addSymbol(e) {
      const pos = this.$refs.input.selectionStart;
      let newSymbol = e.srcElement.innerText;
      this.verse = [this.verse.slice(0, pos), newSymbol, this.verse.slice(pos)].join("");
      this.$refs.input.focus();
    }
  }
});
