//  -------------------------------------------------
// * Copyright by Salam Aslah & Ali Abu Arab (2018) *
//  -------------------------------------------------

/**
 * @description Check if character is whitespace
 * @param {string} character - character of formula
 * @returns {boolean}
 */
function isWhitespace(character) { return character.trim() === ''; }


/**
 * @description Check if character is operator (, ), ¬, →, ∧, ∨
 * @param {string} character 
 * @returns {boolean}
 */
function isOperator(character) { return operators.includes(character); }


/**
 * @description Check if character is a letter like p,q,r,... or undescore '_'
 * @param {string} character 
 * @returns {boolean}
 */
function isLetter(character) { return character.match(/[A-Za-z_]/); }


/**
 * @description Show error message, set dispaly block of error div 
 */
function showErrMsg() { errorMsg.style.display = "block"; }


/**
 * @description Hide error message, set dispaly none of error div 
 */
function hideErrMsg() { errorMsg.style.display = "none"; }


/**
 * @description Alert error message in red div above input field
 * @param {string} msg 
 */
function error(msg) {
  showErrMsg();
  errorMsg.innerText = msg;
  $('#tabs').hide();
}


/**
 * @description Check if the character is valid, [numbers, letters, whitespace]
 * @param {string} character 
 */
function isCharValid(character) { 
  return (character.match(/^[a-zA-Z0-9\s]+$/i) 
    || parentheses.includes(character) 
    || operators.includes(character) 
    || concludeOperators.includes(character));
}


/**
 * @description Sorting string letters in alphabetical order
 * @param {string} str 
 */
function sort(str) { return str.split('').sort().join(''); }