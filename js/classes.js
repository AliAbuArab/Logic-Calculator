//  -------------------------------------------------
// * Copyright by Salam Aslah & Ali Abu Arab (2018) *
//  -------------------------------------------------

/**
 * @class
 */
class SuperClass {
  /**
   * @constructor
   */
  constructor() {
    this.operandsList = [];
  }

  /**
   * @description Converting tree to string
   * @param {object} node 
   * @param {string} upOperator 
   * @returns {string}
   */
  treeToString(node, upOperator) {
    let str = "";
    if (node instanceof OperandNode) return node.operand;
    if (node instanceof NotNode) return NOT + this.treeToString(node.underNode, null);
    if (upOperator != null && node.operator != upOperator) str += '(';
    str += this.treeToString(node.left, node.operator) + node.operator + this.treeToString(node.right, node.operator);
    if (upOperator != null && node.operator != upOperator) str += ')';
    return str;
  }

  
  /**
   * @description Cloning tree
   * @param {object} node 
   * @returns {object} node
   */
  cloneTree(node) {
    // The node kind of TrueNode
    if (node instanceof TrueNode) return new TrueNode;
    // The node kind of FalseNode
    else if (node instanceof FalseNode) return new FalseNode;
    // The node is OperandNode
    else if (node instanceof OperandNode) return new OperandNode(node.operand);
    // The node is NotNode
    else if (node instanceof NotNode) return new NotNode(this.cloneTree(node.underNode));
    // The node is BinaryNode
    return new BinaryNode(node.operator, this.cloneTree(node.left), this.cloneTree(node.right));
  }


  /**
   * @description Sort the tree by alphabetical order and remove duplicate operands 
   * @param {object} node 
   * @param {[]} set 
   * @param {string} upOperator 
   * @returns {object} node
   */
  sortTree(node, set, upOperator) {
    // We are standing on operand node
    if (node.isUnary() || node.isNot()) {
      // The node is not
      if (node.isNot()) {
        if (set.has(NOT + node.underNode.operand)) return null;
        set.add(NOT + node.underNode.operand);
      }
      // The node is (operand | T | F) 
      else {
        if (set.has(node.operand)) return null;
        set.add(node.operand);
      }
    }

    // We are standing on binary node
    else 
    {
      if ((node.left.isUnary() || node.left.isNot()) && node.right.isBinary()) 
      {
        const tmp = node.left;
        node.left = node.right;
        node.right = tmp;
      }

      if (node.left.isBinary() && node.left.operator != node.operator) set.clear();

      node.left = this.sortTree(node.left, set, node.operator);
      node.right = this.sortTree(node.right, set, node.operator);

      if (node.left == null || node.right == null) 
      {
        if ((upOperator != null && upOperator != node.operator) || upOperator == null) 
        {
          const ret = readFormula(([...set].sort().join(node.operator) + EOF).split(''));
          set.clear();
          if (node.left != null && node.left.isBinary()) {
            node.right = ret;
            return node;
          }
          return ret;
        }
        if (node.left == null) return node.right; // If left side operand is exist, change the root the right side
        return node.left; // If right side operand is exist, change the root the left side
      }

      // Convert the set to array then sorted by alphabetical order then convert it to tree
      if (upOperator != node.operator) 
      {
        if ((node.left.isBinary() && node.left.operator != node.operator)
          ||(node.right.isBinary() && node.right.operator != node.operator)
          ||(node.left.isUnary() && node.right.isBinary())
          || set.size <= 1)
        {
          if (set.size) 
          {
            const ret = readFormula(([...set].sort().join(node.operator) + EOF).split(''));
            // else if (node.right.left.isBinary()) node.right.right = ret; 
            if (node.right == null || node.right.isUnary()) node.right = ret;
            else node.right = new BinaryNode(node.operator, node.right, ret);
          }
          return node;
        }
        const newNode = readFormula(([...set].sort().join(node.operator) + EOF).split(''));
        set.clear();
        return newNode;
      }

      if (node.left.isBinary() && node.right.isUnary() && set.size)
        return node.left;

      if ((node.left.isUnary() || node.left.isNot()) && (node.right.isUnary() || node.right.isNot()))
        return null;
    }
    return node;
  }


  /**
   * @description Update the operands set for each node
   * @param {object} node 
   * @param {Set} set 
   */ 
  updateNodeOperands(node, set) {
    // We are standing on operand | T | F node
    if (node.isUnary()) 
    {
      node.operandsList.push(node.operand);
      set.add(node.operand);
    }
    // We standong on not node
    else if (node.isNot())
    {
      this.updateNodeOperands(node.underNode, set);
      const underSet = set
      set = new Set;
      set.forEach(underSet.add, underSet);                // Merge the left set with the right set
      //underSet.forEach(node.operandsSet.add, node.operandsSet); // Add the operands to the node set
      node.operandsList = [...underSet];
    } 
    // We standing on binary node 
    else
    {
      this.updateNodeOperands(node.left, set);
      const leftSideSet = set
      set = new Set;
      this.updateNodeOperands(node.right, set);
      set.forEach(leftSideSet.add, leftSideSet);                  // Merge the left set with the right set
      //leftSideSet.forEach(node.operandsSet.add, node.operandsSet);// Add the operands to the node set
      node.operandsList = [...leftSideSet];
    }
  }


  /**
   * @description Update the operands set for each node
   */ 
  updateOperandsList() {
    this.updateNodeOperands(this, new Set);
  }


  /**
   * @description Sort the tree by alphabetical order and remove duplicate operands 
   * @returns {object} node
   */
  sort() {
    return this.sortTree(this, new Set, null);
  }


  /**
   * @description Converting tree to string
   * @returns {string}
   */
  toString() { return this.treeToString(this, null); }


  /**
   * @description Cloning tree
   * @returns {object} node
   */
  clone() { 
    const ret = this.cloneTree(this);
    ret.updateOperandsList();
    return ret;
  }


  /**
   * @description Check if node is Binary
   * @returns {boolean}
   */
  isBinary() { return this instanceof BinaryNode; }


  /**
   * @description Check if node is Unary like operand | T | F
   * @returns {boolean}
   */
  isUnary() { return this instanceof UnaryNode; }


  /**
   * @description Check if node is Not
   * @returns {boolean}
   */
  isNot() { return this instanceof NotNode; }


  /**
   * @description Check if node is true
   * @returns {boolean}
   */
  isTrue() { return this instanceof TrueNode; }


  /**
   * @description Check if node is false
   * @returns {boolean}
   */
  isFalse() { return this instanceof FalseNode; }


  /**
   * @description Check if node is Binary and is AND Node
   * @returns {boolean}
   */
  isAnd() {
    if (!this.isBinary()) throw "Can't call isAnd() because the node is not binary";
    return this.operator == AND;
  }


  /**
   * @description Check if node is Binary and is OR Node
   * @returns {boolean}
   */
  isOr() {
    if (!this.isBinary()) throw "Can't call isOr() because the node is not binary";
    return this.operator == OR;
  }
} // class SuperClass


/**
 * @class
 */
class UnaryNode extends SuperClass {
  /**
   * @constructor
   * @param {string} operand 
   */
  constructor(operand) { 
    super();
    this.operand = operand;
  }
} // class UnaryNode


/**
 * @class
 */
class OperandNode extends UnaryNode {
  /**
   * @constructor
   * @param {strong} operand 
   */
  constructor(operand) { 
    super(operand);
  }


  /**
   * @description Return T/F by search the value of operand in operandsMap
   * @param {Map} operandsMap 
   * @returns {boolean}
   */
  calc(operandsMap) {
    return operandsMap.get(this.operand);
  }
} // class OperandNode


/**
 * @class
 */
class TrueNode extends UnaryNode {
  /**
   * @constructor
   * @param {string} operand 
   */
  constructor(operand) { 
    super('T');
  }
  
  /**
   * 
   * @param {Map} operandsMap 
   * @returns {true}
   */
  calc(operandsMap) {
    return true;
  }
} // class TrueNode


/**
 * @class
 */
class FalseNode extends UnaryNode {
  /**
   * @constructor
   * @param {string} operand 
   */
  constructor(operand) { 
    super('F');
  }

  /**
   * 
   * @param {Map} operandsMap 
   * @returns {false}
   */
  calc(operandsMap) {
    return false;
  }
} // class FalseNode


/**
 * @class
 */
class NotNode extends SuperClass {
  /**
   * @constructor
   * @param {object} underNode 
   */
  constructor(underNode) { 
    super();
    this.underNode = underNode;
  }

  /**
   * @description Return the negation of the calc result
   * @param {Map} operandsMap 
   * @returns {boolean}
   */
  calc(operandsMap) {
    return !this.underNode.calc(operandsMap);
  }
} // class NotNode


/**
 * @class
 */
class BinaryNode extends SuperClass {
  /**
   * @description ImpliesNode | ORNode | ANDNode constructor
   * @constructor
   * @param {string} operator 
   * @param {object} left 
   * @param {object} right 
   */
  constructor(operator, left, right) {
    super();
    this.operator = operator; 
    this.left = left;
    this.right = right;
  }
  

  /**
   * @description Return the result of calculation of OR | AND | Implies
   * @param {Map} operandsMap 
   * @returns {boolean}
   */
  calc(operandsMap) {
    // AND operator
    if (this.isAnd())
      return this.left.calc(operandsMap) && this.right.calc(operandsMap);
    // OR operator
    if (this.isOr())
      return this.left.calc(operandsMap) || this.right.calc(operandsMap);
    // Implies operator
    return !this.left.calc(operandsMap) || this.right.calc(operandsMap);
  }
} // class BinaryNode