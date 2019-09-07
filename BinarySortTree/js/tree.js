// Setup BST name space
BST.namespace('BST.Tree');

BST.Tree = function() {
    "use strict";
    
    // Guard against this object not being invoked with the "new" operator
    if (!(this instanceof BST.Tree)) {
        return new BST.Tree();
    }
    
    var xPos,
        rootNode,
        publicInterface,
        layer,
        stage = new Kinetic.Stage({
                    container: "container",
                    width: 800,
                    height: 500
                });
        
    //获取二叉树的结点数量
    function getSize(node) {
    
        if (node === undefined) {
            return 0;
        } else {
            return 1 + getSize(node.getLeft()) + getSize(node.getRight());
        }
    }


    //获取二叉树的深度
    function getHeight(node) {
        
        if (node === undefined) {
            return 0;
        } else {
            return Math.max(getHeight(node.getLeft()), getHeight(node.getRight())) + 1;
        }
    }//二叉树的深度
    
    function getWidth(node, widthArray, level) {
        
        if (node === undefined) {
            return;
        }
        
        if (widthArray[level] === undefined) {
            widthArray[level] = 1;
        } else {
            widthArray[level]++;
        }
        
        if (node.getLeft() !== undefined) {
            getWidth(node.getLeft(), widthArray, (level + 1));
        }
        
        if (node.getRight() !== undefined) {
            getWidth(node.getRight(), widthArray, (level + 1));
        }
    }

    function traverseInOrderRecursive(node, valuesInOrder) {

        if (node === undefined) {
            return;
        }

        traverseInOrderRecursive(node.getLeft(), valuesInOrder);
        valuesInOrder.push(node.getValue());
        traverseInOrderRecursive(node.getRight(), valuesInOrder);
    }//中序递归遍历

    function traverseInOrderIterative(node, valuesInOrder) {
        var nodeStack = [];

        while ((nodeStack.length > 0) || (node !== undefined)) {

            if (node !== undefined) {
                nodeStack.push(node);
                node = node.getLeft();
            } else {
                node = nodeStack.pop()
                valuesInOrder.push(node.getValue());
                node = node.getRight();
            }
        }
    }//中序迭代遍历

    function traversePreOrderRecursive(node, valuesPreOrder) {

        if (node == undefined) {
            return;
        }

        valuesPreOrder.push(node.getValue());
        traversePreOrderRecursive(node.getLeft(), valuesPreOrder);
        traversePreOrderRecursive(node.getRight(), valuesPreOrder);
    }//先序递归遍历

    function traversePreOrderIterative(node, valuesPreOrder) {
        var nodeStack = [];

        while ((nodeStack.length > 0) || (node !== undefined)) {

            if (node !== undefined) {
                valuesPreOrder.push(node.getValue());

                if (node.getRight() !== undefined) {
                    nodeStack.push(node.getRight());
                }

                node = node.getLeft();
            } else {
                node = nodeStack.pop();
            }
        }
    }//先序迭代遍历

    function traversePostOrderRecursive(node, valuesPostOrder) {

        if (node === undefined) {
            return;
        }

        traversePostOrderRecursive(node.getLeft(), valuesPostOrder);
        traversePostOrderRecursive(node.getRight(), valuesPostOrder);
        valuesPostOrder.push(node.getValue());
    }//后序递归遍历

    function traversePostOrderIterative(node, valuesPostOrder) {
        var prevNode,
            nodeStack = [];

        nodeStack.push(node);
        prevNode = undefined;

        while (nodeStack.length > 0) {
            node = nodeStack[nodeStack.length - 1];

            if ((prevNode === undefined) || (prevNode.getLeft() == node) || (prevNode.getRight() == node)) {

                if (node.getLeft() !== undefined) {
                    nodeStack.push(node.getLeft());
                } else if (node.getRight() !== undefined) {
                    nodeStack.push(node.getRight());
                }
            } else if (node.getLeft() == prevNode) {

                if (node.getRight() !== undefined) {
                    nodeStack.push(node.getRight());
                }
            } else {
                valuesPostOrder.push(node.getValue());
                nodeStack.pop();
            }
            prevNode = node;
        }
    }//后续迭代遍历

    //给二叉树添加结点
    function addNode(node, checkNode) {
        if (rootNode === undefined) {
                rootNode = node;
        } else {
            
            if (node.getValue() < checkNode.getValue()) {
                
                if (checkNode.getLeft() === undefined) {
                    checkNode.setLeft(node);
                } else {
                    addNode(node, checkNode.getLeft())
                }
            } else if (node.getValue() > checkNode.getValue()) {
                
                if (checkNode.getRight() === undefined) {
                    checkNode.setRight(node);
                } else {
                    addNode(node, checkNode.getRight())
                }
            }
        }   
    }

    //
    function knuthLayoutLines(layer, yPos, inc, node) {
        var thisPt,
            leftPt,
            rightPt;

        if (node.getLeft() !== undefined) {
            leftPt = knuthLayoutLines(layer, (yPos + (inc * 1.5)), inc, node.getLeft());
        }
        
        thisPt = [xPos, yPos];
        xPos += inc;
    
        if (node.getRight() !== undefined) {
            rightPt = knuthLayoutLines(layer, (yPos + (inc * 1.5)), inc, node.getRight());
        }
        
        if (leftPt !== undefined) {
            layer.add(new Kinetic.Line({
                points: [thisPt, leftPt],
                stroke: 'black',
                strokeWidth: 1
            }));
        }
        
        if (rightPt !== undefined) {
            layer.add(new Kinetic.Line({
                points: [thisPt, rightPt],
                stroke: 'black',
                strokeWidth: 1
            }));
        }
    
        return thisPt;
    }
    
    function knuthLayoutNodes(layer, yPos, radius, inc, node) {

        if (node.getLeft() !== undefined) {
            knuthLayoutNodes(layer, (yPos + (inc * 1.5)), radius, inc, node.getLeft());
        }
    
        drawNode(layer, [xPos, yPos], radius, node);
        xPos += inc;
    
        if (node.getRight() !== undefined) {
            knuthLayoutNodes(layer, (yPos + (inc * 1.5)), radius, inc, node.getRight());
        }
    }

    //中序排列
    function inOrderLayoutNode(layer, yPos) {
        var xPos = 20,
            valuesInOrder = [];
        
        traverseInOrderIterative(rootNode, valuesInOrder);
        
        layer.add(new Kinetic.Text({
            x: xPos - 10,
            y: yPos,
            text: "Node Values In Order",
            fontSize: 8,
            fontFamily: 'Calibri',
            fill: 'black'
        }));
        
        yPos += 30;
        
        for (var i = 0; i < valuesInOrder.length; i++) {
            drawNode(layer, [xPos, yPos], 10, new BST.Node(valuesInOrder[i]));
            xPos += 30;
        }
    }

    //先序排列
    function preOrderLayoutNode(layer, yPos) {
        var xPos = 20,
            valuesPreOrder = [];
        
        traversePreOrderIterative(rootNode, valuesPreOrder);
        
        layer.add(new Kinetic.Text({
            x: xPos - 10,
            y: yPos,
            text: "Node Values Pre Order",
            fontSize: 8,
            fontFamily: 'Calibri',
            fill: 'black'
        }));
        
        yPos += 30;
        
        for (var i = 0; i < valuesPreOrder.length; i++) {
            drawNode(layer, [xPos, yPos], 10, new BST.Node(valuesPreOrder[i]));
            xPos += 30;
        }
    }

    //后序排列
    function postOrderLayoutNode(layer, yPos) {
        var xPos = 20,
            valuesPostOrder = [];
        
        traversePostOrderIterative(rootNode, valuesPostOrder);
        
        layer.add(new Kinetic.Text({
            x: xPos - 10,
            y: yPos,
            text: "Node Values Post Order",
            fontSize: 8,
            fontFamily: 'Calibri',
            fill: 'black'
        }));
        
        yPos += 30;
        
        for (var i = 0; i < valuesPostOrder.length; i++) {
            drawNode(layer, [xPos, yPos], 10, new BST.Node(valuesPostOrder[i]));
            xPos += 30;
        }
    }

    //画结点
    function drawNode(layer, thisPt, radius, node) {//画结点
        
        layer.add(new Kinetic.Circle({
            x: thisPt[0],
            y: thisPt[1],
            radius: radius,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 1
        }));
        
        layer.add(new Kinetic.Text({
            x: thisPt[0] - 3,
            y: thisPt[1] - 3,
            text: node.getValue(),
            fontSize: 12,
            fontFamily: 'Calibri',
            fill: 'black'
        }));
    }
    
    // Public Interface - any methods defined here should be well documented
    publicInterface = {
        addValue: function(value) {
            
            if ((typeof value === 'number') && (value % 1 == 0)) {
                addNode(new BST.Node(value), rootNode);
            } else {
                throw new Error("Value must be a valid integer.");
            }
        },
        getValuesInOrder: function(method) {
            var valuesInOrder = [];
            
            if (method == "recursive") {
                traverseInOrderRecursive(rootNode, valuesInOrder);
            } else if (method == "iterative") {
                traverseInOrderIterative(rootNode, valuesInOrder);
            }
            
            return valuesInOrder;
        },
        getValuesPreOrder: function(method) {
            var valuesPreOrder = [];
            
            if (method == "recursive") {
                traversePreOrderRecursive(rootNode, valuesPreOrder);
            } else if (method == "iterative") {
                traversePreOrderIterative(rootNode, valuesPreOrder);
            }
            
            return valuesPreOrder;
        },
        getValuesPostOrder: function(method) {
            var valuesPostOrder = [];
            
            if (method == "recursive") {
                traversePostOrderRecursive(rootNode, valuesPostOrder);
            } else if (method == "iterative") {
                traversePostOrderIterative(rootNode, valuesPostOrder);
            }
            
            return valuesPostOrder;
        },
        getTreeHeight: function() {
            return getHeight(rootNode);
        },
        getTreeSize: function() {
            return getSize(rootNode);
        },
        getTreeWidth: function() {
            var widthArray = [];
            
            getWidth(rootNode, widthArray, 0);
            
            widthArray = widthArray.sort(function(a,b){return a-b});
            
            return widthArray[widthArray.length - 1];
        },
        drawNodesInOrder: function() {
            var yPos = 10;
            
            inOrderLayoutNode(layer, yPos);
        },
        drawNodesPreOrder: function() {
            var yPos = 70;
            
            preOrderLayoutNode(layer, yPos);
        },
        drawNodesPostOrder: function() {
            var yPos = 130;
            
            postOrderLayoutNode(layer, yPos);
        },
        drawTree: function() {
            var yPos = 190;
            
            stage = new Kinetic.Stage({
                container: "container",
                width: 800,
                height: 500
            });
            
            layer.add(new Kinetic.Text({
                x: 10,
                y: yPos,
                text: "Tree View",
                fontSize: 10,
                fontFamily: 'Calibri',
                fill: 'black'
            }));
            
            layer.add(new Kinetic.Text({
                x: 20,
                y: yPos += 20,
                text: "Tree Size: " + publicInterface.getTreeSize(rootNode),
                fontSize: 10,
                fontFamily: 'Calibri',
                fill: 'black'
            }));
            
            layer.add(new Kinetic.Text({
                x: 20,
                y: yPos += 10,
                text: "Tree Height: " + publicInterface.getTreeHeight(rootNode),
                fontSize: 10,
                fontFamily: 'Calibri',
                fill: 'black'
            }));
            
            layer.add(new Kinetic.Text({
                x: 20,
                y: yPos += 10,
                text: "Tree Width: " + publicInterface.getTreeWidth(),
                fontSize: 10,
                fontFamily: 'Calibri',
                fill: 'black'
            }));
            
            yPos += 30;
            xPos = 20;
            knuthLayoutLines(layer, yPos, 20, rootNode);
            xPos = 20;
            knuthLayoutNodes(layer, yPos, 10, 20, rootNode);
            
            stage.add(layer);
        },
        addNewNode: function(value) {
            
            if ((typeof value === 'number') && (value % 1 == 0)) {
                
                if (layer !== undefined) {
                    layer.destroy();
                }
                
                addNode(new BST.Node(value), rootNode);
                
                layer = new Kinetic.Layer();
                
                publicInterface.drawNodesPreOrder();
                publicInterface.drawNodesInOrder();
                publicInterface.drawNodesPostOrder();
                publicInterface.drawTree();
                
            } else {
                throw new Error("Value must be a valid integer.");
            }
        },
        clearTree: function() {
            rootNode = undefined;
            
            layer.destroy();
        }
    }
    
    return publicInterface;
}