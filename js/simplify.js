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
function solve_ϕ_operator_not_ϕ(list1, list2, bool) {
  let flag = false;
  // Iterate over list2
  for (let i = 0; i < list2.length; i++) {
    const oneListOfList2 = list2[i];
    // if (oneListOfList2.length > 1) {
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
        // if (bool == FALSE) {
        //   // Iterate over single sup list in list1
        //   for (; k < oneListOfList1.length; k++) if (! oneListOfList2.includes(makeAnOpposite(oneListOfList1[k]))) break;
        //   // If all oneListOfList1 includes in oneListOfList2
        //   if (k == oneListOfList1.length) {
        //     for (k = 0; k < oneListOfList2.length; k++) {
        //       if (oneListOfList1.includes(makeAnOpposite(oneListOfList2[k]))) {
        //         oneListOfList2.splice(k, 1);
        //         k--;
        //       }
        //     }
        //     list1.splice(j, 1); // Remove list1[j]
        //     flag = true;
        //   }
        // } else {
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
            if (! oneListOfList1.length) list2.splice(i, 1); // Remove empty list [] from list2
            else for (k = 0; k < oneListOfList1.length; k++) oneListOfList2.push(oneListOfList1[k]);
            list1.splice(j, 1); // Remove empty list [] from list1
            flag = true;
          }
        //}
      }
    // } else {
    //   const operand = oneListOfList2[0];
    //   // Iterate over list2
    //   for (let j = i + 1; j < list2.length; j++) {
    //     const innerList = list2[j];
    //     // Iterate over single sup list in list2
    //     for (let k = 0; k < innerList.length; k++) {
    //       if (isOpposite(operand, innerList[k])) {
    //         list2.splice(i, 1); // remove operand from list
    //         innerList.splice(k, 1); // remove operand from list
    //         if (oneListOfList2.length == 0) list2.splice(i, 1); // Remove empty list [] from list2
    //         if (innerList.length == 0) list2.splice(j - 1, 1); // Remove empty list [] from list2
    //         solve_ϕ_OR_NOT_ϕ(list1, list2); // Because there is a change we should iterate again
    //       }
    //     }
    //   }
    // }
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
 * @param {Array} andList 
 * @returns {boolean} If it solve return true otherwise return false
 */
function solve_t_or_ϕ_or_f_and_ϕ(list, bool) {
  let flag = false;
  for (let i = 0; i < list.length; i++) 
    if (list[i].includes(bool)) {
      list[i] = [bool];
      flag = true;
    }
  if (list.length == 1) flag = false;
  return flag;
}


/**
 * @description Solve ((F ∨ ϕ) = ϕ  Or ((T ∧ ϕ) = ϕ
 * @param {Array} orList 
 * @returns {boolean} If it solve return true otherwise return false
 */
function solve_t_and_ϕ_or_f_or_ϕ(list, bool) {
  let flag = false;
  for (let i = 0; i < list.length; i++) {
    // If list is orList(CNF)
    if (bool == FALSE && list[i].length == 1 && list[i][0] == TRUE) {
      list.splice(i, 1);
      flag = true;
    }
    // If list is orList(CNF) and there is ['F'] empty the list
    else if (bool == FALSE && list[i].length == 1 && list[i][0] == FALSE) {
      list.splice(0, list.length);
      list.push([FALSE]);
      flag = true;
    }
    // If list is andList(DNF) and there is ['T'] empty the list
    else if (bool == TRUE && list[i].length == 1 && list[i][0] == TRUE) {
      list.splice(0, list.length);
      list.push([TRUE]);
      flag = true;
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
 * @param {Array} andList 
 * @param {Array} orList 
 * @returns {boolean} If it solve return true otherwise return false
 */
function solve_ϕ_operator_ϕ_operator_ψ(andList, orList) {
  let flag = false;
  for (let i = 0; i < andList.length; i++) {
    const oneListOfAnd = andList[i];
    if (oneListOfAnd.length == 1) {
      for (let j = 0; j < orList.length; j++) {
        if (orList[j].includes(oneListOfAnd[0])) {
          orList.splice(j, 1);
          flag = true;
        }
      }
    } else {
      for (let j = i+1; j < andList.length; j++) {
        let k = 0;
        for (; k < oneListOfAnd; k++) if (! andList[j].includes(oneListOfAnd[k])) break;
        if (k == oneListOfAnd.length) {
          andList.splice(j, 1);
          flag = true;
        }
      }
    }
  }
  return flag;
}

function simplify2(node, andList, orList,op) {
  if (node.isUnary() || node.isNot()) return node.toString();
  // simplify(node.left),simplify(node.right);
  const left = simplify2(node.left, andList, orList,op);
  if(op==AND){
    if (node.isAnd()) {
      if(orList.length==0){
        andList.push(left);
      }

      andList.push(orList.slice());
      orList=[];
    }
    else{
      orList.push(left);
    }
  }
  const right = simplify2(node.right, andList, orList,op);
  if(op==AND){
    if (node.isAnd()) {
      if(orList.length==0){
        andList.push(right);
      }
      andList.push(orList.slice());
      orList=[];
    }
    else{
      orList.push(right);
    }
  }

}

/**
 * @description Simplify formula tree after CNF/DNF formatting
 * @param {object} node 
 * @returns {JSON} node
 */
function simplify(node) {
  // node = node.sort();
  
  if (node.isUnary() || node.isNot()) return node.toString();

  const separated = node.separate();
  const andList = separated.andList;
  const orList = separated.orList;

  console.log("andList:");
  console.log(andList);
  console.log("orList:");
  console.log(orList);

  let arr;
  do {
    arr = [
      // Solve (ϕ ∧ ϕ) = ϕ  Or  (ϕ ∨ ϕ) = ϕ
      solve_ϕ_duplicates(andList, orList),
      // Solve (T ∨ ϕ) = T
      solve_t_or_ϕ_or_f_and_ϕ(orList, TRUE),
      // Solve (F ∧ ϕ) = F
      solve_t_or_ϕ_or_f_and_ϕ(andList, FALSE),
      // Solve (F ∨ ϕ) = ϕ 
      solve_t_and_ϕ_or_f_or_ϕ(orList, FALSE),
      // Solve (T ∧ ϕ) = ϕ
      solve_t_and_ϕ_or_f_or_ϕ(andList, TRUE),
      // Solve (ϕ ∨ ¬ϕ) = T  Or  ϕ ∨ (¬ϕ ∧ ψ) = ϕ ∨ ψ
      solve_ϕ_operator_not_ϕ(andList, orList, TRUE),
      // Solve (ϕ ∧ ¬ϕ) = F  Or ϕ ∧ (¬ϕ ∨ ψ) = ϕ ∧ ψ
      solve_ϕ_operator_not_ϕ(orList, andList, FALSE),
      // Solve (ϕ ∧ (ϕ ∨ ψ)) = ϕ  Or  (ϕ ∨ (ϕ ∧ ψ)) = ϕ
      solve_ϕ_operator_ϕ_operator_ψ(andList, orList),
      // Solve (ϕ ∧ (ϕ ∨ ψ)) = ϕ  Or  (ϕ ∨ (ϕ ∧ ψ)) = ϕ
      solve_ϕ_operator_ϕ_operator_ψ(orList, andList)
    ];
  } while (arr.includes(true));


  /*
  // Solve (ϕ ∧ ϕ) = ϕ  Or  (ϕ ∨ ϕ) = ϕ
  console.log(solve_ϕ_duplicates(andList, orList));
  // Solve (T ∨ ϕ) = T
  console.log(solve_T_OR_ϕ_OR_F_AND_ϕ(orList, TRUE));
  // Solve (F ∧ ϕ) = F
  console.log(solve_T_OR_ϕ_OR_F_AND_ϕ(andList, FALSE));
  // Solve (F ∨ ϕ) = ϕ 
  console.log(solve_T_AND_ϕ_OR_F_OR_ϕ(orList, FALSE));
  // Solve (T ∧ ϕ) = ϕ
  console.log(solve_T_AND_ϕ_OR_F_OR_ϕ(andList, TRUE));
  // Solve (ϕ ∨ ¬ϕ) = T  Or  ϕ ∨ (¬ϕ ∧ ψ) = ϕ ∨ ψ
  console.log(solve_ϕ_OR_NOT_ϕ(andList, orList));
  */

  console.log("andList:");
  console.log(andList);
  console.log("orList:");
  console.log(orList);
  

  // node = simplifyHelper(node, new Set, null);
  return node.toString();
}