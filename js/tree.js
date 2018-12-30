//  -------------------------------------------------
// * Copyright by Salam Aslah & Ali Abu Arab (2018) *
//  -------------------------------------------------


/**
 * @description Simplify formula, formate can be CNF/DNF 
 * @param {object} node
 * @returns {object} node
 */
function simplifyHelper(node, set, upOperator) {
  // We are standing on operand node
  if (node.isUnary() || node.isNot()) 
  {
    // The node is not
    if (node.isNot()) {
      if (set.has(node.underNode.operand)) return null;
      set.add(NOT + node.underNode.operand);
    }
    // The node is (operand | T | F) 
    else {
      if (set.has(NOT + node.operand)) return null;
      set.add(node.operand);
    }
  }
  // We are standing on binary node
  else
  {
    node.left = simplifyHelper(node.left, set, node.operator);
    node.right = simplifyHelper(node.right, set, node.operator);

    // Clear the set because the operator is changed
    if (node.operator != upOperator) set.clear();

    // We are standing on '∨' node
    if (node.isOr()) 
    {
      // Solve (ϕ ∨ ¬ϕ) = T
      if (node.left == null || node.right == null) return new TrueNode;
      // Solve (T ∨ ϕ) = T
      if (node.left.isTrue()) return node.left;
      if (node.right.isTrue()) return node.right
      // Solve (F ∨ ϕ) = ϕ
      if (node.left.isFalse()) return node.right;
      if (node.right.isFalse()) return node.left;
    }
    // We are standing on '∧' node
    else 
    {
      // Solve (ϕ ∧ ¬ϕ) = F
      if (node.left == null || node.right == null) return new FalseNode;
      // Solve (T ∧ ϕ) = ϕ
      if (node.left.isTrue()) return node.right;
      if (node.right.isTrue()) return node.left;
      // Solve (F ∧ ϕ) = F
      if (node.left.isFalse()) return node.left;
      if (node.right.isFalse()) return node.right;
    }

    // Solve (ϕ ∧ ϕ) = ϕ  Or  (ϕ ∨ ϕ) = ϕ
    if (node.left.toString() == node.right.toString()) return node.left;

    // Solve (ϕ ∧ (ϕ ∨ ψ)) = ϕ  Or  (ϕ ∨ (ϕ ∧ ψ)) = ϕ
    // if ((node.left.isBinary() && node.left.operator != node.operator)
    //   || (node.right.isBinary() && node.right.operator != node.operator)) 
    // {
      // if (node.left.isBinary() 
      //   && node.right.isBinary() 
      //   && node.left.operator != node.operator 
      //   && node.right.operator != node.operator)
      // {
        if (node.left.toString().includes(node.right.toString())) return node.right;
        if (node.right.toString().includes(node.left.toString())) return node.left;
      // }
    // }
  }
  return node;
}










/*
| Function:    removeDuplicates
| args:        node, set ,flag
| return:      node
| description: Remove duplicates node
*/
function removeDuplicates(node) {
	let newnode;
  // We are standing on operand node
  if (node.isUnary() || node.isNot()) return node;

  // We are standing on binary node
  else {
    node.left = removeDuplicates(node.left);
    //1. (Q OR ¬Q,Q AND ¬Q)
    if(isNotOther(node.left, node.right)) 
    {
    	if (node.isAnd()) return new FalseNode;
    	else return new TrueNode;
    }
    
    //2. (T OR Q,T AND Q) , (Q OR T,Q AND T)
    if (isTrueNode(node) != 0) 
    {
    	if (node.isOr()) return new TrueNode; //2.1 (T OR Q = T)
    	if (isTrueNode(node) < 0) return node.right; //2.2 (T AND Q = Q)
      else return node.left;//2.3 (Q AND T = Q)
    }
    //3. (F OR Q , F AND Q) , (Q OR F,Q AND F)
    if (isFalseNode(node) != 0 )
    {
    	if (node.isAnd()) return new FalseNode;//3.1 (F AND Q=F)
    	if (isFalseNode(node) < 0) return node.right;//3.2 (F OR Q = Q)
      else return node.left;//3.3 (Q OR F= Q)
    }
    //4. (Q OR Q),(Q AND Q)= Q
    node = isSetsEquals(node);
    //5 (Q OR (Q AND W)),(Q AND (Q OR W)) = Q
    if ((newnode = isAndOrSub(node)) != null) return newnode;
    //6(Q AND (W OR ¬Q))
    node = isAndOrNotSub(node);
    node.right = removeDuplicates(node.right);
  }
  return node;
}



function isAndOrNotSub(node) {
  if ((node.isBinary() && node.isAnd()) && ((node.left.isBinary() && node.left.isOr()) || (node.right.isBinary() && node.right.isOr())))
  {
    if(node.left.toString().length < node.right.toString().length)
    	node.right = notSubTree(node.right, node.left, OR);
    else 
    	node.left = notSubTree(node.left, node.right, OR);
  }

  if ((node.isBinary() && node.isOr()) && ((node.left.isBinary() && node.left.isAnd())|| (node.right.isBinary() && node.right.isAnd()))) 
  {
    if (node.left.toString().length < node.right.toString().length)
    	node.right = notSubTree(node.right, node.left, AND);
    else 
    	node.left = notSubTree(node.left, node.right, AND);
  }
  return node;
}




function isAndOrSub(node) {
  if ((node.isBinary() && node.isOr()) && ((node.left.isBinary() && node.left.isAnd()) || (node.right.isBinary() && node.right.isAnd())))
  {
  	if (node.left.toString().length < node.right.toString().length)
  	  if (subTree(node.right, node.left, AND, false))
        return node.left;
         
  	else if (subTree(node.left, node.right, AND, false))
  	 	return node.right;
  }
   
  if ((node.isBinary() && node.isAnd()) && ((node.left.isBinary() && node.left.isOr()) || (node.right.isBinary() && node.right.isOr())))
  {
    if(node.left.toString().length < node.right.toString().length)
  	  if(subTree(node.right, node.left, OR, false))
  	    return node.left;

  	else if(subTree(node.left, node.right, OR, false))
  	  return node.right;
  }
  return null;
}



function notSubTree(nodel, noder, op) {
  if (nodel.isBinary() && nodel.operator != op) return nodel;
  if (nodel.isUnary() || nodel.isNot()) return nodel;
  nodel.left = notSubTree(nodel.left, noder, op);
  if (isNotOther(nodel.left, noder))
  	return nodel.right;
  if (isNotOther(nodel.right, noder))
  	return nodel.left;
  nodel.right = notSubTree(nodel.right, noder, op);
  return nodel;
}



function isTrueNode(node) {
  if (node.left.isTrue()) return -1;
  if (node.right.isTrue()) return 1;
  return 0;
}

function isFalseNode(node) {
  if (node.left.isFalse()) return -1;
  if (node.right.isFalse()) return 1;
  return 0;
}

function isSetsEquals(node) {
  if (node.left.isEqual(node.right)) return node.left;
  return node;
}

function subTree(nodel, noder, op, flag) {
  if (nodel.isBinary() && nodel.operator != op) return false;
  if (nodel.isUnary() || nodel.isNot()) return false;
  if (nodel.left.isEqual(noder) || nodel.right.isEqual(noder))
    flag = true;
  return subTree(nodel.left, noder, op) || subTree(nodel.right, noder, op) || flag;
}



function isNotOther(nodel, noder) {
  let i,j,flag=0;
  strl = nodel.toString();
  strr = noder.toString();
  for (i=0,j=0 ; i < strl.length ; i++,j++)
  {
    if (j >= strr.length) return false;
    if (strl.charAt(i) == NOT) 
    {
      if (strl.charAt(i+1) != strr.charAt(j)) return false;
      else i++;
    }
    if (strl.charAt(i) == OR && strr.charAt(j) != AND) return false;
    if (strl.charAt(i) == OR && strr.charAt(j) == AND) flag = 1;
    if (strl.charAt(i) == AND && strr.charAt(j) != OR) return false;
    if (strl.charAt(i) == AND && strr.charAt(j) == OR) flag = 1;
    if (strr.charAt(j) == NOT)
    {
      if (strl.charAt(i) != strr.charAt(j+1)) return false;
      else j++;
    }
    if (flag == 0 && strl.charAt(i) != strr.charAt(j)) return false;
    flag = 0;
  }
  return true;
}