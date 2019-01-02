//  -------------------------------------------------
// * Copyright by Salam Aslah & Ali Abu Arab (2018) *
//  -------------------------------------------------

/**
 * @description The main function that will run the program
 */
function run() {
  formula = input.value; // Get input value as string
  formula = formula.trim(); // Remove white spaces from begin/end of formula
  traction = formula.indexOf("⊨");
  if (traction == -1) equivalence = formula.indexOf("⊣⊢");
  $("#truthTable").remove(); // Remove the truth table from DOM if exist
  $("#nav-truth-table-tab").hide();
  $("#nav-cnf-dnf-tab").hide();
  $("#cnf-dnf-section").hide();
  $("#imgResult").hide();
  $("#tabs").show();

  try {
    // There is no symbol (⊨ | ⊣⊢) in the formula
    if (traction == -1 && equivalence == -1) {
      formula = formula.split(""); // Convert the string to array
      formula.push(EOF); // Add '$' to end of string, that will help in readFormula function
      tree = readFormula(formula); // Convert the formula to tree
      createTruthTable(tree); // Create truth table and add it to HTML DOM
      tree = impFree_nnf(tree); // Run impFree and nnf algorithm on the tree
      CNF_Tree = tree.clone(); // Cloninig original tree to formatting it to CNF style
      DNF_Tree = tree.clone(); // Cloninig original tree to formatting it to DNF style
      CNF_Tree = cnf(CNF_Tree); // Convert formula to CNF formate
      DNF_Tree = dnf(DNF_Tree); // Convert formula to DNF formate
      $("#cnfText").val(CNF_Tree.toString());
      $("#dnfText").val(DNF_Tree.toString());
      $("#cnfSymplifiedText").val(simplify(CNF_Tree, CNF_FORMAT));
      $("#dnfSymplifiedText").val(simplify(DNF_Tree, DNF_FORMAT));
      $("#nav-truth-table-tab").show();
      $("#nav-cnf-dnf-tab").show();
      $("#cnf-dnf-section").show();
      $("#nav-truth-table-tab").click();
    }
    // There is symbol (⊨) in the formula
    else if (traction != -1) {
      lhs = formula.substring(0, traction); // Get substring before sign (⊨)
      rhs = formula.substring(traction + 1); // Get substring after sign (⊨)
      lhs = lhs.trim(); // Remove white spaces from begin/end of formula
      rhs = rhs.trim(); // Remove white spaces from begin/end of formula
      lhs = lhs.split(","); // Split the string by comma,  "p∧q,p→q" => ["p∧q","p→q"]
      lhs = lhs.map(str => str.trim()); // Remove white spaces from begin/end of each formula in array
      isTraction = isFormulasTractionSemantic(lhs, rhs);
      $("#imgResult").attr("src", isTraction ? "images/correct.png" : "images/incorrect.png");
      $("#imgResult").show();
    }
    // There is symbol (⊣⊢) in the formula
    else {
      lhs = formula.substring(0, equivalence); // Get substring before sign (⊨)
      rhs = formula.substring(equivalence + 2); // Get substring after sign (⊨)
      lhs = lhs.trim(); // Remove white spaces from begin/end of formula
      rhs = rhs.trim(); // Remove white spaces from begin/end of formula
      isEquivalence = isFormulasEquivalenceSemantic(lhs, rhs);
      $("#imgResult").attr("src", isEquivalence ? "images/correct.png" : "images/incorrect.png");
      $("#imgResult").show();
    }
  } catch (e) {
    console.log(e);
    console.log("line = " + e.line); // Print the line's number that cause an exception on the console
    error(e); // Show the error in red error message div
  }
}
