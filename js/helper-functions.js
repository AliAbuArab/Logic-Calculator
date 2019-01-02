//  -------------------------------------------------
// * Copyright by Salam Aslah & Ali Abu Arab (2018) *
//  -------------------------------------------------

/**
 * @description Check if character is whitespace
 * @param {string} character - character of formula
 * @returns {boolean}
 */
function isWhitespace(character) {
  return character.trim() === "";
}


/**
 * @description Check if character is operator (, ), ¬, →, ∧, ∨
 * @param {string} character
 * @returns {boolean}
 */
function isOperator(character) {
  return operators.includes(character);
}


/**
 * @description Check if character is a letter like p,q,r,... or undescore '_'
 * @param {string} character
 * @returns {boolean}
 */
function isLetter(character) {
  return character.match(/[A-Za-z_]/);
}


/**
 * @description Show error message, set dispaly block of error div
 */
function showErrMsg() {
  errorMsg.style.display = "block";
}


/**
 * @description Hide error message, set dispaly none of error div
 */
function hideErrMsg() {
  errorMsg.style.display = "none";
}


/**
 * @description Alert error message in red div above input field
 * @param {string} msg
 */
function error(msg) {
  showErrMsg();
  errorMsg.innerText = msg;
  $("#tabs").hide();
}


/**
 * @description Check if the character is valid, [numbers, letters, whitespace]
 * @param {string} character
 */
function isCharValid(character) {
  return (
    character.match(/^[a-zA-Z0-9\s]+$/i) ||
    parentheses.includes(character) ||
    operators.includes(character) ||
    concludeOperators.includes(character)
  );
}


/**
 * @description Sorting string letters in alphabetical order
 * @param {string} str
 */
function sort(str) {
  return str.split("").sort().join("");
}


/**
 * @description Check if two lists is equal
 * @param {Array} list1
 * @param {Array} list2
 * @returns {boolean}
 */
function listIsEqual(list1, list2) {
  // Check if lists not the same length
  if (list1.length != list2.length) return false;
  // Iterate over list1
  for (let i = 0; i < list1.length; i++) {
    let flag = false;
    const outList = list1[i];
    // Iterate over list2
    for (let j = 0; j < list2.length; j++) {
      const inList = list2[j];
      let k = 0;
      if (outList.length != inList.length) continue;
      // Iterate over list1[i]
      for (; k < outList.length; k++) if (!inList.includes(outList[k])) break;
      if (k == outList.length) {
        flag = true;
        break;
      }
    }
    if (!flag) return false;
  }
  return true;
}
