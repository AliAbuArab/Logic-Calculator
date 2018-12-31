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
  // (ϕ | ϕ)
  if (lhs == rhs) return false;
  if (
    // (T | F)
    (lhs == TRUE && rhs == FALSE) ||
    // (F | T)
    (lhs == FALSE && rhs == TRUE) ||
    // (ϕ | ¬ϕ)
    (lhs[0] != NOT && rhs[0] == NOT && lhs == rhs[1]) ||
    // (¬ϕ | ϕ)
    (rhs[0] != NOT && lhs[0] == NOT && rhs == lhs[1])
  ) return true;
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
          oneListOfList2.splice(j, 1); // remove operand from list
          oneListOfList2.splice(k - 1, 1); // remove operand from list
          oneListOfList2.push(bool);
          flag = true;
        }
      }
    }
    // Iterate over list1
    for (let j = 0; j < list1.length; j++) {
      const oneListOfList1 = list1[j];
      let k = 0;
      // Iterate over single sup list in list1
      for (; k < oneListOfList2.length; k++) if (! oneListOfList1.includes(makeAnOpposite(oneListOfList2[k]))) break;
      // If all oneListOfList2 includes in oneListOfList1
      if (k == oneListOfList2.length) {
        for (k = 0; k < oneListOfList1.length; k++) {
          if (oneListOfList2.includes(makeAnOpposite(oneListOfList1[k]))) {
            oneListOfList1.splice(k, 1);
            k--;
          }
        }
        // if (! oneListOfList1.length) list2.splice(i, 1); // Remove empty list [] from list2
        // else for (k = 0; k < oneListOfList1.length; k++) oneListOfList2.push(oneListOfList1[k]);
        // list1.splice(j, 1); // Remove empty list [] from list1
        flag = true;
      }
      // bool = TRUE  =>  list1 = orList
      // bool = FALSE =>  list1 = andList
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
function solve_t_or_ϕ_or_f_and_ϕ(list, list2, bool) {
  let flag = false;
  for (let i = 0; i < list.length; i++) {
    if (list[i].includes(bool) && list[i].length > 1) {
      list.splice(i ,1);
      // list[i] = [bool];
      list2.push([bool]);
      flag = true;
    }
  }
  if (list.length == 1) flag = false;
  return flag;
}


/**
 * @description Solve ((F ∨ ϕ) = ϕ  Or ((T ∧ ϕ) = ϕ
 * @param {Array} orList 
 * @returns {boolean} If it solve return true otherwise return false
 */
function solve_t_and_ϕ_or_f_or_ϕ(list, bool, format) {
  let flag = false;
  for (let i = 0; i < list.length; i++) {
    // If list is orList(CNF)
    if (bool == FALSE && list[i].length == 1 && list[i][0] == TRUE) {
      list.splice(i, 1);
      flag = true;
    }
    // If list is orList(CNF) and there is ['F'] empty the list
    else if (bool == FALSE && list[i].length == 1 && list[i][0] == FALSE) {
      if (list.length == 1 && list[0] == FALSE) flag = false;
      else {
        list.splice(0, list.length);
        list.push([FALSE]);
        flag = true;
      }
    }
    // If list is andList(DNF) and there is ['T'] empty the list
    else if (bool == TRUE && list[i].length == 1 && list[i][0] == TRUE) {
      list.splice(0, list.length);
      if (format == DNF_FORMAT) {
        list.push([TRUE]);
        flag = true;
      } else {
        flag = false;
      }
    }
    //
    else if (list[i].includes(bool)) {
      list[i].splice(list[i].indexOf(bool), 1);
      if (! list[i].length) list.splice(i, 1);
      flag = true;
    }
  }
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
    if (oneListOfList1.length == 1) {
      for (let j = 0; j < list2.length; j++) {
        if (list2[j].includes(oneListOfList1[0])) {
          list2.splice(j, 1);
          flag = true;
        }
      }
    } else {
      for (let j = i+1; j < list1.length; j++) {
        let k = 0;
        for (; k < oneListOfList1.length; k++) if (! list1[j].includes(oneListOfList1[k])) break;
        if (k == oneListOfList1.length) {
          list1.splice(j, 1);
          flag = true;
        }
      }

      for (let j = 0 ; j < list2.length; j++) {
        const oneListOfList2 = list2[j];
        for (let k = 0 ; k < oneListOfList1.length ; k++) { 
          if (oneListOfList2.includes(oneListOfList1[k])) {
            if (formate == CNF_FORMAT) 
              list1.splice(i, 1);
            else
              list2.splice(j, 1);
            return true;        
          }
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
      solve_t_and_ϕ_or_f_or_ϕ(orList, FALSE),
      // Solve (T ∧ ϕ) = ϕ
      solve_t_and_ϕ_or_f_or_ϕ(andList, TRUE),
      // Solve (ϕ ∨ ¬ϕ) = T  Or  ϕ ∨ (¬ϕ ∧ ψ) = ϕ ∨ ψ
      solve_ϕ_operator_not_ϕ(andList, orList, TRUE),
      // Solve (ϕ ∧ ¬ϕ) = F  Or ϕ ∧ (¬ϕ ∨ ψ) = ϕ ∧ ψ
      solve_ϕ_operator_not_ϕ(orList, andList, FALSE),
      // Solve (ϕ ∧ (ϕ ∨ ψ)) = ϕ  Or  (ϕ ∨ (ϕ ∧ ψ)) = ϕ
      solve_ϕ_operator_ϕ_operator_ψ(andList, orList, CNF_FORMAT),
      // Solve (ϕ ∧ (ϕ ∨ ψ)) = ϕ  Or  (ϕ ∨ (ϕ ∧ ψ)) = ϕ
      solve_ϕ_operator_ϕ_operator_ψ(orList, andList, DNF_FORMAT)
    ];
  } while (arr.includes(true));

  if (! andList.length && ! orList.length) return TRUE;
  if (! andList.length) return listToString(orList, OR);
  if (! orList.length) return listToString(andList, AND);
  return listToString(andList, AND) + (format == CNF_FORMAT ? AND : OR) + listToString(orList, OR);
}