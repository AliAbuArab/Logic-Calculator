//  -------------------------------------------------
// * Copyright by Salam Aslah & Ali Abu Arab (2018) *
//  -------------------------------------------------

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
//
$('#tabs').hide();
$('#imgResult').hide();