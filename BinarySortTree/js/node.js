// Setup BST Prey name space
BST.namespace('BST.Node');

BST.Node = function(value) {
    "use strict";
    
    // Guard against this object not being invoked with the "new" operator
    if (!(this instanceof BST.Node)) {
        return new BST.Node(value);
    }
    
    var publicInterface,
        nodeValue = value,
        leftChild,
        rightChild;
    
    // Public Interface - any methods defined here should be well documented
    publicInterface = {
        setValue: function(value) {
            nodeValue = value;
        },
        getValue: function() {
            return nodeValue;
        },
        setLeft: function(left) {
            leftChild = left;
        },
        getLeft: function() {
            return leftChild;
        },
        setRight: function(right) {
            rightChild = right;
        },
        getRight: function() {
            return rightChild;
        }
    }
    
    return publicInterface;
}