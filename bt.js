'use strict';

function btree(m) {
  return {
    root: null,
    order: m,
    maxKeys: m-1,
    minChild: Math.ceil(m/2),
    minKeys: Math.ceil(m/2)-1,
    isEmpty: function(){return (this.root === null)},
    exists: function(item, node=this.root) {
      if (this.root === null) return false;
      if (node.contains(item)) return true;
      if (node.isLeaf) return false; 
      return (this.exists(item, node.child[node.subTree(item)]));
    },
    find: function(item, node){
      if (this.root === null) return false;
      // return node that contains item or 
      //   the leaf node where item will be inserted
      if ((node.isLeaf) || (node.contains(item))) {
        return node;
      } else {
        let pos = node.subTree(item);
        return this.find(item, node.child[pos]);
      }
    }
  }
}

function makeNode() {
  return {
    isLeaf: true,
    parent: null, 
    keys: [],    // max: m-1
    child: [],   // max: m
    keyCount : function() { return this.keys.length; } ,
    contains: function(item) { return (this.keys.includes(item))},
    // returns index of child[] ≈≈ the subTree to search for item
    subTree: function(item){
      if(item < this.keys[0]) {
         return 0;
      } else {
        let index = this.keys.findIndex((e) => e > item);
        return (index === -1) ? this.keyCount() : index;
      } 
    },
    insert: function (item) {
      this.keys.push(item); 
      this.keys.sort((a,b) => ((a<b) ? -1 : ((a>b) ? 1: 0)));
      // console.log(`node keys: ${this.keys}`)
    }
  } 
}

function insert(tree, item){
  // console.log(`insert: ${item}`);
  if(tree.root === null) {
    tree.root = makeNode();
    tree.root.keys.push(item);
  } else {
    // get leaf to insert item into, unless already in tree
    // console.log(tree.root);
    let node = tree.find(item, tree.root);  
    if (!node.contains(item)) {
      node.insert(item);
      // make into recursive function
      if (node.keyCount() > tree.maxKeys) {
        split(tree, node)
      } 
    }
  }
};

function split(tree, node) {
  // leaf node is split ≈≈ left and right
  let right = splitRight(node);
  let left = splitLeft(node);
  // will push midKey to parent
  let midKey = left.keys.pop();

  // was root just split? get new root node 
  newRootNode(tree, left, right, midKey);
  if (left.parent === null) { 
    newRootNode(tree, left, right, midKey);
  } else {
    // push middle key to parent
  }
}
function splitRight(node) {
  let middle = Math.floor(node.keys.length/2);
  // move right half into new node
  let newNode = makeNode();
  newNode.keys = node.keys.slice(middle+1);
  if (!node.isLeaf) console.log('deal with links!');
  return newNode;
}
function splitLeft(node) {
  let middle = Math.floor(node.keys.length/2);
  node.keys.splice(middle+1);
  if (!node.isLeaf) console.log('deal with links!');
  return node;
}

function newRootNode(tree, left, right, key) {
  let newRoot = makeNode();
  newRoot.parent === null;
  tree.root = newRoot;
  newRoot.keys.push(key);
  newRoot.child[0] = left;
  newRoot.child[1] = right;
  newRoot.isLeaf = false;
  // parent of the just split nodes ≈≈ new root
  left.parent = newRoot;
  right.parent = newRoot;
}
function traverse(tree) {
  
}
const testTree = btree(3);
insert(testTree, 4);
insert(testTree, 2);
insert(testTree, 7);
insert(testTree, 1);
/*
insert(testTree, 4);
*/
module.exports.btree = btree;
module.exports.insert = insert;
