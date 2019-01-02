//  -------------------------------------------------
// * Copyright by Salam Aslah & Ali Abu Arab (2018) *
//  -------------------------------------------------

/**
 * @description Check semantic traction between formulas
 * @param {Array} lhs 
 * @param {string} rhs
 * @returns {boolean}
 */
function isFormulasTractionSemantic(lhs, rhs) {
    const truthfulAssign = [];          // Array of truthful assignment
    rhs = rhs.split('');                // Convert the string to array
    rhs.push(EOF);                      // Add '$' to end of string, that will help in readFormula function
    rhs = readFormula(rhs);             // Convert the formula to tree
    
    // Convert the array's string to tree
    for (let i = 0 ; i < lhs.length ; i++)
    {
        lhs[i] = lhs[i].split('');          // Convert the string to array
        lhs[i].push(EOF);                   // Add '$' to end of string, that will help in readFormula function
        lhs[i] = readFormula(lhs[i]);       // Convert the formula to tree
    }
    // Get the truth table of each tree
    // Iterate over trees
    for (let i = 0 ; i < lhs.length ; i++)
    {
        const tree = lhs[i];
        const numOfOperands = tree.operandsList.length;
        const truthTable = getTruthTable(tree);
        // Iterate over truth table rows
        for (let j = 0 ; j < truthTable.length ; j++)
        {
            const row = truthTable[j];
            const mapOfOperandsVal = new Map;
            if (row[numOfOperands] == 0) continue;  // Continue if the result of calc is false
            // Iterate over colmuns of row
            for (let k = 0 ; k < numOfOperands ; k++) mapOfOperandsVal.set(tree.operandsList[k], row[k]);
            // Iterate over the trees to ceck if mapOfOperandsVal returns true
            let flag = true;
            for (let k = 0 ; k < lhs.length ; k++) 
            {
                if (k == i) continue;
                if (lhs[k].calc(mapOfOperandsVal) == false) flag = false;
            }
            if (flag) truthfulAssign.push(mapOfOperandsVal);
        }
    }

    let flag = true;
    for (let i = 0 ; i < truthfulAssign.length ; i++) if (rhs.calc(truthfulAssign[i]) == false) flag = false;
    return flag;
}


/**
 * @description Check verification of semantic equivalence between formulas
 * @param {string} lhs 
 * @param {string} rhs
 * @returns {boolean} 
 */
function isFormulasEquivalenceSemantic(lhs, rhs) {
    lhs = lhs.split('');                // Convert the string to array
    lhs.push(EOF);                      // Add '$' to end of string, that will help in readFormula function
    lhs = readFormula(lhs);             // Convert the formula to tree

    rhs = rhs.split('');                // Convert the string to array
    rhs.push(EOF);                      // Add '$' to end of string, that will help in readFormula function
    rhs = readFormula(rhs);             // Convert the formula to tree

    // Check if same amount of operands
    if (lhs.operandsList.length != rhs.operandsList.length) return false;
    // Check if not the same operands
    for (let i = 0 ; i < lhs.operandsList.length ; i++) if (!rhs.operandsList.includes(lhs.operandsList[i])) return false;
    const lhsTable = getTruthTable(lhs);
    const rhsTable = getTruthTable(rhs);
    for (let i = 0 ; i < lhsTable.length ; i++) 
        if (lhsTable[i][lhs.operandsList.length] != rhsTable[i][rhs.operandsList.length])
            return false;
    return true;
}