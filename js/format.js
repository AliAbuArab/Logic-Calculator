//  -------------------------------------------------
// * Copyright by Salam Aslah & Ali Abu Arab (2018) *
//  -------------------------------------------------

/**
 * @description Return the formula formatted to IMP_FREE style
 * @param {object} node
 * @returns {object} node
 */
function impFree(node) {
    // The node kind of UnaryNode (OperandNode | TrueNode | FalseNode)
    if (node.isUnary()) return node;
    // The node kind of NotNode
    else if (node.isNot()) {
        node.underNode = impFree(node.underNode);
        return node;
    }
    // The node kind of BinaryNode
    else {
        if (node.operator == IMPLIES) {
            node.left = new NotNode(impFree(node.left));
            node.operator = OR;
        }
        else {
            node.left = impFree(node.left);
        }
        node.right = impFree(node.right);
        return node;
    }
}
  

/**
 * @description Return the formula formatted to NNF style
 * @param {object} node 
 * @returns {object} node
 */
function nnf(node) {
    // node is opernad
    if (node.isUnary()) 
        return node;

    // node is binary
    else if (node.isBinary()) 
        return new BinaryNode(node.operator, nnf(node.left), nnf(node.right));

    // node is not
    else {
        if (node.underNode.isNot()) return nnf(node.underNode.underNode);
        if (node.underNode.isTrue()) return new FalseNode;
        if (node.underNode.isFalse()) return new TrueNode;
        if (node.underNode.isBinary()) {
            // And node
            if (node.underNode.isAnd())
                return nnf(new BinaryNode(OR, new NotNode(node.underNode.left), new NotNode(node.underNode.right)));
            // Or node 
            return nnf(new BinaryNode(AND, new NotNode(node.underNode.left), new NotNode(node.underNode.right)));
        }
        return node;
    }
}
  

/**
 * @description Return the formula Distr formatted to CNF style
 * @param {object} nodeLeft 
 * @param {object} nodeRight 
 * @returns {object} node
 */
function cnfDistr(nodeLeft, nodeRight) {
    let leftChild ,rightChild;
    if (nodeLeft.isBinary() && nodeLeft.isAnd()) {
        leftChild = new BinaryNode(OR,nodeLeft.left,nodeRight);
        rightChild = new BinaryNode(OR,nodeLeft.right,nodeRight);
    }
    else {
        leftChild = new BinaryNode(OR,nodeLeft,nodeRight.left);
        rightChild = new BinaryNode(OR,nodeLeft,nodeRight.right);
    }
    return new BinaryNode(AND,leftChild,rightChild);
}
  

/**
 * @description Return the formula formatted to CNF style
 * @param {object} node 
 * @returns {object} node 
 */
function cnf(node) {
    if (node.isUnary() || node.isNot())
        return node;

    if (node.isOr()
        && ((node.left.isBinary() && node.left.isAnd()) 
        || (node.right.isBinary() && node.right.isAnd())))
        node = cnfDistr(node.left, node.right);

    node.left = cnf(node.left);
    node.right = cnf(node.right);

    if (node.isOr()
        && ((node.left.isBinary() && node.left.isAnd()) 
        || (node.right.isBinary() && node.right.isAnd())))
        node = cnfDistr(node.left, node.right);
        
    return node;
}
  

/**
 * @description Return the formula Distr formatted to DNF style
 * @param {object} nodeLeft 
 * @param {object} nodeRight 
 */
function dnfDistr(nodeLeft, nodeRight) {
    let leftChild ,rightChild;
    if (nodeLeft.isBinary() && nodeLeft.isOr()) {
        leftChild = new BinaryNode(AND, nodeLeft.left, nodeRight);
        rightChild = new BinaryNode(AND, nodeLeft.right, nodeRight);
    }
    else {
        leftChild = new BinaryNode(AND, nodeLeft, nodeRight.left);
        rightChild = new BinaryNode(AND, nodeLeft, nodeRight.right);
    }
    return new BinaryNode(OR, leftChild, rightChild);
}
  

/**
 * @description Return the formula formatted to DNF style
 * @param {object} node
 * @returns {object} node
 */
function dnf(node) {
    if (node.isUnary() || node.isNot())
        return node;

    if (node.isAnd()
        && ((node.left.isBinary() && node.left.isOr()) 
        || (node.right.isBinary() && node.right.isOr())))
        node = dnfDistr(node.left, node.right);

    node.left = dnf(node.left);
    node.right = dnf(node.right);

    if (node.isAnd()
        && ((node.left.isBinary() && node.left.isOr()) 
        || (node.right.isBinary() && node.right.isOr())))
        node = dnfDistr(node.left, node.right);

    return node;
}