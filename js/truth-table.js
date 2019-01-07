//  -------------------------------------------------
// * Copyright by Salam Aslah & Ali Abu Arab (2018) *
//  -------------------------------------------------


/**
 * @description Return truth table fillable
 * @param {(UnaryNode | BinaryNode)} tree 
 * @returns {[]} Two dimensional array
 */
function getTruthTable(tree) {
    return getTruthTableRecursively(0, tree);
}


/**
 * @description Return truth table fillable
 * @param {number} i 
 * @param {(UnaryNode | BinaryNode)} tree 
 * @returns {[]} Two dimensional array
 */
function getTruthTableRecursively(i, tree) {
    // Iterate number of rows
    if (i == 2**tree.operandsList.length) return []; 
  
    const operandsValueMap = new Map();           // Create new map for saving operand's value
    const binaryVal = i.toString(2);              // Convert from integer to binary
    let j = k = 0;  
    const row = [];
    //
    while (j < tree.operandsList.length - binaryVal.length) {
        row.push(0);                                // Add new column in truth table
        operandsValueMap.set(tree.operandsList[j], 0);   // Add the value (0) of operand to map
        j++;
    }
    //
    while (j < tree.operandsList.length) {
        row.push(Number(binaryVal.charAt(k)));                              // Add new column in truth table
        operandsValueMap.set(tree.operandsList[j], Number(binaryVal.charAt(k))); // Add the value (0/1) of operand to map                                              // Add new column in truth table
        j++;
        k++;
    }
    // Fill the last column of each row that have the result of assignement (T/F) in formula
    row.push(tree.calc(operandsValueMap));  // Add the result of calculation to the row

    const table = getTruthTableRecursively(i+1, tree); // Recursive call
    table.push(row);
    return table;
}


/**
 * @description Create the truth table
 * @param {object} tree 
 */
function createTruthTable(tree) {
    const table = document.createElement("table");          // Create new HTML table element
    table.setAttribute('id', 'truthTable');                 // Set id for HTML Table element
    table.className = "mx-auto table table-bordered mb-5";  // Add class attribute for styling
    const tableHeader = document.createElement("thead");    // Create table header HTML element
    const tableBody = document.createElement("tbody");      // Create table body HTML element
    const row = document.createElement("tr");               // Create table row HTML element for heading
    
    // Fill the first table's row for operands and formula
    for (let operand of tree.operandsList) {
        const col = document.createElement("th");
        col.innerHTML = operand;
        row.appendChild(col);
    }
  
    // Add the formula to table's heading
    const lastCol = document.createElement("th");
    lastCol.innerHTML = tree.toString();
    row.appendChild(lastCol);
  
    // Add the heading to the table
    tableHeader.appendChild(row);
    table.appendChild(tableHeader);
  
    // Fill the body of truth table
    const tableValues = getTruthTable(tree);

    for (let i = 0 ; i < tableValues.length ; i++)
    {
        const row = document.createElement("tr");     // Create new column
        for (let j = 0 ; j < tableValues[i].length ; j++)
        {
            const col = document.createElement("td");   // Create new column
            col.innerHTML = tableValues[i][j] ? TRUE : FALSE; // Set value of column to T/F
            col.className = tableValues[i][j] ? 'green' : 'red'; // Set color of column to green/red
            row.appendChild(col);                       // Add new column to the row
        }
        tableBody.appendChild(row);   // Add the new result row to the table
    }
    
    table.appendChild(tableBody); // Add table's body for the table
    truthTableDiv.appendChild(table);   // Add the table to the HTML document

    new ClipboardJS('#copy-button');
}