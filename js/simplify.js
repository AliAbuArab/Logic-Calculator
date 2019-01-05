//  -------------------------------------------------
// * Copyright by Salam Aslah & Ali Abu Arab (2018) *
//  -------------------------------------------------

/**
 * @description Check if lhs is an opposite of rhs
 * @param {string} lhs 
 * @param {string} rhs
 * @returns {boolean} 
 */
function isOpposite(lhs, rhs) {
  if (typeof lhs != typeof rhs) return false;
  // Work on strings
  if (typeof lhs == 'string') {
    // (ϕ | ϕ)
    if (lhs == rhs) return false;
    if (
      // (T | F)
      (lhs == TRUE && rhs == FALSE) ||
      // (F | T)
      (lhs == FALSE && rhs == TRUE) ||
      // (ϕ | ¬ϕ)
      (lhs[0] != NOT && rhs[0] == NOT && lhs == rhs.substring(1, rhs.length)) ||
      // (¬ϕ | ϕ)
      (rhs[0] != NOT && lhs[0] == NOT && rhs == lhs.substring(1, lhs.length))
    ) return true;
  }
  // Work on array/list
  if (typeof lhs == 'object') {
    if (lhs.length != rhs.length) return false;
    let i;
    for (i = 0; i < lhs.length; i++) if (! rhs.includes(makeAnOpposite(lhs[i]))) break;
    if (i == lhs.length) return true;
  }
  return false;
}


/**
 * @description Return an opposite of operand
 * @param {string} operand
 * @returns {string}
 */
function makeAnOpposite(operand) {
  if (operand == TRUE) return FALSE;
  if (operand == FALSE) return TRUE;
  if (operand[0] == NOT) return operand[1];
  return NOT + operand;
}


/**
 * @description Solve (ϕ ∨ ¬ϕ) = T  Or  ϕ ∨ (¬ϕ ∧ ψ) = ϕ ∨ ψ  Or  (ϕ ∧ ¬ϕ) = F  Or ϕ ∧ (¬ϕ ∨ ψ) = ϕ ∧ ψ
 * @param {Array} list1 
 * @param {Array} list2 
 * @param {string} bool
 */
function solve_ϕ_operator_not_ϕ(list1, list2, bool, format) {
  let flag = false;
  // Iterate over list2
  for (let i = 0; i < list2.length; i++) {
    const oneListOfList2 = list2[i];
    // Iterate over single sup list in list2
    for (let j = 0; j < oneListOfList2.length; j++) {
      const operand = oneListOfList2[j];
      // Iterate over single sup list in list2
      for (let k = j + 1; k < oneListOfList2.length; k++) {
        if (isOpposite(operand, oneListOfList2[k])) {
          list2.splice(i, 1);
          if (! list1.length) list1.push([bool]);
          i--;
          flag = true;
          break;
        }
      }
      if (flag) break;
    }
    // Iterate over list1
    for (let j = 0; j < list1.length; j++) {
      const oneListOfList1 = list1[j];
      let k = 0;
      // Iterate over single sup list in list1
      for (; k < oneListOfList2.length; k++) if (! oneListOfList1.includes(makeAnOpposite(oneListOfList2[k]))) break;
      // If all oneListOfList2 includes in oneListOfList1
      if (k == oneListOfList2.length) {
        if (oneListOfList1.length == oneListOfList2.length) {
          list1.splice(j, 1);
          list2.splice(i, 1);
          list1.push([format == CNF_FORMAT ? FALSE : TRUE]);
          i--;
          flag = true;
          break;
        }
        for (k = 0; k < oneListOfList1.length; k++) {
          if (oneListOfList2.includes(makeAnOpposite(oneListOfList1[k]))) {
            oneListOfList1.splice(k, 1);
            k--;
          }
        }
        if (! oneListOfList1.length) {
          list1.splice(j, 1);
          j--;
        }
        flag = true;
      }
      for (; k < oneListOfList2.length; k++) {
        if (oneListOfList1.includes(makeAnOpposite(oneListOfList2[k]))) {
          if (format == CNF_FORMAT) 
            oneListOfList2.splice(k, 1);
          else 
            oneListOfList1.splice(oneListOfList1.indexOf(makeAnOpposite(oneListOfList2[k])), 1);
          flag = true;
        }
      }
    }
  }
  return flag;
}


/**
 * @description Solve (ϕ ∧ ϕ) = ϕ  Or  (ϕ ∨ ϕ) = ϕ
 * @param {Array} andList 
 * @param {Array} orList 
 * @returns {boolean} If it solve return true otherwise return false
 */
function solve_ϕ_duplicates(andList, orList) {
  for (let i = 0; i < andList.length; i++) 
    for (let j = i+1; j < andList.length; j++) 
      if (listIsEqual(andList[i], andList[j])) andList.splice(j ,1); 
  for (let i = 0; i < orList.length; i++) 
    for (let j = i+1; j < orList.length; j++) 
      if (listIsEqual(orList[i], orList[j])) orList.splice(j ,1);
  return false;
}


/**
 * @description Solve (T ∨ ϕ) = T  Or  (F ∧ ϕ) = F
 * @param {Array} list1
 * @param {Array} list2
 * @returns {boolean} If it solve return true otherwise return false
 */
function solve_t_or_ϕ_or_f_and_ϕ(list1, list2, bool, format) {
  let flag = false;
  const opposite = bool == TRUE ? FALSE : TRUE;

  for (let i = 0; i < list1.length; i++) {
    if (list1[i].length == 1 && list1[i][0] == opposite) {
      list1.splice(0, list1.length);
      list1.push([opposite]);
      flag = true;
    }
    else if (list1[i].length > 1 && list1[i].includes(bool)) {
      list1[i] = [bool];
      flag = true;
    }
  }

  if (((bool == TRUE && format == DNF_FORMAT) || (bool == FALSE && format == CNF_FORMAT)) 
    && ((list1.length == 1 && list1[0][0] == bool) || (list2.length == 1 && list2[0][0] == bool))) 
  {
    list1.splice(0, list1.length);
    list2.splice(0, list2.length);
    list1.push(bool);
  }

  if (list1.length == 1) flag = false;
  return flag;
}


/**
 * @description Solve ((F ∨ ϕ) = ϕ  Or ((T ∧ ϕ) = ϕ
 * @param {Array} orList 
 * @returns {boolean} If it solve return true otherwise return false
 */
function solve_t_and_ϕ_or_f_or_ϕ(list1, list2, bool) {
  let flag = false;
  const opposite = bool == TRUE ? FALSE : TRUE;

  for (let i = 0; i < list1.length; i++) {
    if (list1[i].includes(bool) && list1[i].length != 1) {
      list1[i].splice(list1[i].indexOf(bool), 1);
      flag = true;
    }

    if (! list1[i].length || (list1[i].length == 1 && list1[i][0] == opposite && list1.length != 1)) {
      list1.splice(i, 1);
      i--;
      flag = true;
    }
  }
  
  if (list1.length == 1 && list1[0][0] == bool && ((bool == FALSE && list2.length) || bool == TRUE)) list1.splice(0, 1);
  if (list2.length == 1 && list2[0][0] == bool && ((bool == FALSE && list1.length) || bool == TRUE)) list2.splice(0, 1);

  return flag;
}


/**
 * @description Solve (ϕ ∧ (ϕ ∨ ψ)) = ϕ  Or  (ϕ ∨ (ϕ ∧ ψ)) = ϕ
 * @param {Array} list1 
 * @param {Array} list2 
 * @param {Number} formate
 * @returns {boolean} If it solve return true otherwise return false
 */
function solve_ϕ_operator_ϕ_operator_ψ(list1, list2, formate) {
  let flag = false;
  for (let i = 0; i < list1.length; i++) {
    const oneListOfList1 = list1[i];
    for (let j = 0; j < list1.length; j++) {
      if (listIsEqual(oneListOfList1, list1[j])) continue;
      let k = 0;
      for (; k < oneListOfList1.length; k++) if (! list1[j].includes(oneListOfList1[k])) break;
      if (k == oneListOfList1.length) {
        list1.splice(j, 1);
        j--;
        flag = true;
      }
    }

    for (let j = 0 ; j < list2.length; j++) {
      const oneListOfList2 = list2[j];
      for (let k = 0 ; k < oneListOfList1.length ; k++) { 
        if (oneListOfList2.includes(oneListOfList1[k])) {
          if (formate == CNF_FORMAT) {
            list2.splice(j, 1);
            j--;
          }
          else {
            list1.splice(i, 1);
            i--;
          }
          flag = true; 
        }
      }
    }
  }
  return flag;
}


/**
 * @description Convert list like [["p"], ["q"]] To (with operator AND To (p∧q)) OR (with operator OR To (p∨q)) 
 * @param {Array} list 
 * @param {string} operator
 * @returns {string} 
 */
function listToString(list, operator) {
  let str = "";
  for (let i = 0; i < list.length; i++) {
    if (list[i].length > 1) str += OPEN_PARENTHESES;
    for (let j = 0; j < list[i].length; j++) {
      str += list[i][j];
      if (j != list[i].length - 1) str += operator;
    }
    if (list[i].length > 1) str += CLOSE_PARENTHESES;
    if (i != list.length - 1) {
      if (operator == AND) str += OR;
      else str += AND;
    }
  }
  return str;
}


/**
 * @description Simplify formula tree after CNF/DNF formatting
 * @param {object} node 
 * @param {Number} formate
 * @returns {JSON} node
 */
function simplify(node, format) { 
  if (node.isUnary() || node.isNot()) return node.toString();

  const separated = node.separate();
  const andList = separated.andList;
  const orList = separated.orList;

  let arr;  // We use array of boolean to check if at least one function returns true then loop again
  do {
    arr = [
      // Solve (ϕ ∧ ϕ) = ϕ  Or  (ϕ ∨ ϕ) = ϕ
      solve_ϕ_duplicates(andList, orList),
      // Solve (T ∨ ϕ) = T
      solve_t_or_ϕ_or_f_and_ϕ(orList, andList, TRUE),
      // Solve (F ∧ ϕ) = F
      solve_t_or_ϕ_or_f_and_ϕ(andList, orList, FALSE),
      // Solve (F ∨ ϕ) = ϕ 
      solve_t_and_ϕ_or_f_or_ϕ(orList, andList, FALSE),
      // Solve (T ∧ ϕ) = ϕ
      solve_t_and_ϕ_or_f_or_ϕ(andList, orList, TRUE),
      // Solve (ϕ ∨ ¬ϕ) = T  Or  ϕ ∨ (¬ϕ ∧ ψ) = ϕ ∨ ψ
      solve_ϕ_operator_not_ϕ(andList, orList, TRUE),
      // Solve (ϕ ∧ ¬ϕ) = F  Or ϕ ∧ (¬ϕ ∨ ψ) = ϕ ∧ ψ
      solve_ϕ_operator_not_ϕ(orList, andList, FALSE),
      // Solve (ϕ ∧ (ϕ ∨ ψ)) = ϕ  Or  (ϕ ∨ (ϕ ∧ ψ)) = ϕ
      solve_ϕ_operator_ϕ_operator_ψ(andList, orList, format),
      // Solve (ϕ ∧ (ϕ ∨ ψ)) = ϕ  Or  (ϕ ∨ (ϕ ∧ ψ)) = ϕ
      solve_ϕ_operator_ϕ_operator_ψ(orList, andList, format)
    ];
  } while (arr.includes(true));

  if (! andList.length && ! orList.length) return TRUE;
  if (! andList.length) return listToString(orList, OR);
  if (! orList.length) return listToString(andList, AND);
  return listToString(andList, AND) + (format == CNF_FORMAT ? AND : OR) + listToString(orList, OR);
}