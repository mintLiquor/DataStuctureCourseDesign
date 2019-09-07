// Global BST namespace for all projects and applications
var BST = BST || {};
if (typeof BST.namespace === "undefined") {
    //
    BST.namespace = function(ns_string) {
        "use strict";
        
        var parts = ns_string.split('.'),
            parent = BST,
            i;
            
        // strip redundant leading global
        if (parts[0] === "BST") {
            parts = parts.slice(1);
        }
    
        for (i = 0; i < parts.length; i += 1) {
            // create a property if it doesn't exist
            if (typeof parent[parts[i]] === "undefined") {
                parent[parts[i]] = {};
            }
            parent = parent[parts[i]];
        }
        return parent;
    };
}

// List of dependant JavaScript files for this module
var jsFiles = [
    "./js/kinetic-v4.7.0.min.js",
    "./js/node.js",
    "./js/tree.js"
];

// Load JavaScript files
for (var i = 0; i < jsFiles.length; i++) {
    document.write("<script type='text/javascript' src='" + jsFiles[i] + "'></script>");
}

var bst;

window.onload = function() {
    bst = new BST.Tree();
    document.getElementById('value').focus();
}

function addNode() {
    bst.addNewNode(parseInt(document.getElementById('value').value));
    document.getElementById('value').value ='';
    document.getElementById('value').focus();
}

function clearTree() {
    bst.clearTree();
    document.getElementById('value').focus();
}

function keyPress() {
    if (event.keyCode==13) {
        document.getElementById("add-node").click();
    }
}

