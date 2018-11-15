let app = new Vue({
  el: "#app",
  data: {
    title: "Logical Calculator",
    greeting: "Welcome to Telhai's Logical Calculator",
    message: "Hello Vue!",
    input: "",
    showDropDownList: false
  },
  watch: {},
  methods: {
    addSymbol(e) {
      this.input += e.srcElement.innerText;
    },
    moveDDlist(e) {
      e = e.srcElement;
      this.showDropDownList = true;
      let startPosition = e.selectionStart;
      let str = "left: " + (e.offsetWidth + startPosition * 10) / 2 + "px;";
      str += "top: " + e.offsetHeight + "px;";
      let dropDownList = document.getElementById("popup");
      dropDownList.setAttribute("style", str);
    },
    hideDropDownList() {
      //this.showDropDownList = false;
    },
    showDropDownList() {
      this.showDropDownList = true;
    }
  }
});
