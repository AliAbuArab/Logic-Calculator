//  -------------------------------------------------
// * Copyright by Salam Aslah & Ali Abu Arab (2018) *
//  -------------------------------------------------

/**
 * @description Return an opposite of operand
 * @param {string} operand
 * @returns {string}
 */
function makeAnOpposite(operand) {
  if (operand == TRUE) return FALSE;
  if (operand == FALSE) return TRUE;
  if (operand[0] == NOT) return operand.substring(1,operand.length);
  return NOT + operand;
}

/**
 * @description check if one list2 has list1 
 * @param {Array} list1
 * @param {Array} list2
 * @returns {boolean} If it solve return true otherwise return false
 */
function isEquals(list1,list2){
  for(let i=0;i<list1.length;i++){
    if(!list2.includes(list1[i])) return false;
  }
  return true;
}


/**
 * @description Solve (ϕ ∧ (ϕ ∨ ψ)) = ϕ  Or  (ϕ ∨ (ϕ ∧ ψ)) = ϕ , ϕ op ϕ = ϕ 
 * @param {Array} list my formula list 
 * @returns {boolean} If it solve return true otherwise return false
 */
function solve_ϕ_duplicates(list) {
  for (let i = 0; i < list.length; i++) 
    if (list[i].length > 1) 
      for (let k = 0; k < list[i].length; k++) 
        for (let m = k+1; m < list[i].length; m++) 
          if (list[i][k] == list[i][m]) list[i].splice(m,1);

  for (let i = 0; i < list.length; i++) {
    for (let j = i+1; j < list.length; j++) { 
      if (list[i].length < list[j].length) {
        if (isEquals(list[i], list[j])) { list.splice(j ,1); return true; }
      }
      else if (isEquals(list[j], list[i])) { list.splice(i ,1); return true; }
    }
  }
  return false;
}


/**
 * @description Solve (ϕ ∧ ¬ϕ) = F ,(ϕ ∨ ¬ϕ) = T ,(ϕ ∨ (¬ϕ ∧ ψ)) = ϕ ∨ ψ,(ϕ ∧ (¬ϕ ∨ ψ)) = ϕ ∧ ψ
 * @param {Array} andList 
 * @param {Array} orList 
 * @returns {boolean} If it solve return true otherwise return false
 */
function solve_ϕ_operator_not_ϕ(list,op){
  let k,j;
  let flag = false;

   for(let i=0;i<list.length;i++){
    if(list[i].length==1){
      for(j=0;j<list.length;j++){
         if(list[j].includes(makeAnOpposite(list[i][0]))){
          if(list[j].length==1){
            list.splice(0,list.length);
            if(op==AND) list.push([FALSE])
            else list.push([TRUE]);
          }
          else list[j].splice(list[j].indexOf(makeAnOpposite(list[i][0])),1);
          return true;
        }
      }
    }
    else{
      for(j=0;j<list[i].length;j++)
        for(k=j+1;k<list[i].length;k++)
          if(list[i][j] == makeAnOpposite(list[i][k])){
            list.splice(i,1);
            if(op==AND)list.push([TRUE]);
            else list.push([FALSE]);
            return true;
          }
      for(j=0;j<list[i].length;j++){
        for(k=0;k<list.length;k++){
          if(list[k].includes(makeAnOpposite(list[i][j]))&&list[k].length==1)flag = true;
        }
        if(!flag)break;
        flag = false;
      }
      if(j == list.length){
        list.splice(0,list.length); 
        if(op==AND) list.push([FALSE])
        else list.push([TRUE]);
        return true;
      }
    }
  }
  return false;
}


/**
 * @description Solve (T ∨ ϕ) = T  Or  (T ∧ ϕ) = ϕ
 * @param {Array} list 
 * @param {string} op
 * @returns {boolean} If it solve return true otherwise return false
 */
function solve_t_or_and_ϕ(list,op) {
  for (let i = 0; i < list.length; i++)
      if (list[i].includes(TRUE)){
         if(op==AND){
          list.splice(i,1);  
          if(list.length == 0)list.push([TRUE]);
        }
         else{
           if(list[i].length==1){
            list.splice(0,list.length);        
            list.push([TRUE]);
           }
           else list[i].splice(list[i].indexOf(TRUE),1);
         }
         if(list.length == 1)return false;
         return true;
       }
  return false;
}

/**
 * @description Solve (F ∨ ϕ) = ϕ  Or  (F ∧ ϕ) = F
 * @param {Array} list 
 * @param {string} op
 * @returns {boolean} If it solve return true otherwise return false
 */
function solve_f_or_and_ϕ(list,op) {
  for (let i = 0; i < list.length; i++)
      if (list[i].includes(FALSE)){
         if(op==OR){ 
          list.splice(i,1); 
          if(list.length==0) list.push([FALSE]);
        }
        else{
          if(list[i].length==1){
            list.splice(0,list.length);        
            list.push([FALSE]);
           }
           else list[i].splice(list[i].indexOf(FALSE),1);
         }
         if(list.length == 1)return false;
         return true;
       }
  return false;
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
      if (j != list[i].length - 1) {
        if(operator == AND) str +=OR;
        else str += AND;
      }
    }
    if (list[i].length > 1) str += CLOSE_PARENTHESES;
    if (i != list.length - 1) 
           str += operator;
  }
  return str;
}


/**
 * @description Simplify formula tree after CNF/DNF formatting
 * @param {object} node 
 * @returns {JSON} node
 */
function simplify(node,op) {
  // (p∧q∧¬r)∨(¬q∧¬s)∨r
  let list;

  if(op==AND) list = node.treeToLists(AND,OR);
  else list = node.treeToLists(OR,AND);  
  do {
    arr = [
      // Solve (ϕ ∧ ¬ϕ) = F  Or ϕ ∧ (¬ϕ ∨ ψ) = ϕ ∧ ψ
      solve_ϕ_operator_not_ϕ(list,op),
      // Solve (ϕ ∧ ϕ) = ϕ  Or  (ϕ ∨ ϕ) = ϕ
      solve_ϕ_duplicates(list),
      // Solve (T ∨ ϕ) = T
      solve_t_or_and_ϕ(list,op),
      // Solve (F ∨ ϕ) = ϕ
      solve_f_or_and_ϕ(list,op)
    ];
  
  } while(arr.includes(true));

 return listToString(list,op);
}