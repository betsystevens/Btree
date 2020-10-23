'use strict';

/*  
 *  JavaScript Implementation of a B tree
 *  m - order of tree ≈ max number of children
 *  
 * nodes are split with left-bias, 
 *  when nodes don't split evenly in two (after removing middle node)
 *  the left side will have one more key than the right side
 *
 * */


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
    keyCount: function() { return this.keys.length; } ,
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
    }
  } 
}

function insert(tree, item){
  if(tree.root === null) {
    tree.root = makeNode();
    tree.root.keys.push(item);
  } else {
    // get leaf to insert item into, unless already in tree
    let node = tree.find(item, tree.root);  
    if (!node.contains(item)) {
      node.insert(item);
      balance(tree, node);
    }
  }
};

function balance(tree, node) {
  if (node.keyCount() > tree.maxKeys) {
    balance(tree, split(tree, node));
  } 
}

function split(tree, node) {
  // leaf node is split ≈≈ left and right
  let right = splitRight(node);
  let left = splitLeft(node);
  // will push midKey to parent
  let midKey = left.keys.pop();

  let parent = left.parent;
  // did we split the root? make new root node 
  if (parent === null) { 
    increaseTreeDepth(tree, left, right, midKey);
    parent = tree.root;
  } else {
    let index = parent.keys.findIndex((e) => e > midKey);
    let pos = (index === -1) ? parent.keyCount() : index;
    parent.keys.splice(pos, 0, midKey);
    parent.child[pos] = left;
    parent.child.splice(pos+1, 0, right);
    right.parent = left.parent;
  }
  return parent;
}
function splitRight(node) {
  let middle = Math.floor(node.keys.length/2);
  // move right half into new node
  let newNode = makeNode();
  newNode.keys = node.keys.slice(middle+1);
  if (!node.isLeaf) {
    // deal with links
    newNode.isLeaf = false;
    newNode.child[0] = node.child[middle+1];
    newNode.child[0].parent = newNode; 
    newNode.child[1] = node.child[middle+2];
    newNode.child[1].parent = newNode; 
  }
  return newNode;
}
function splitLeft(node) {
  let middle = Math.floor(node.keys.length/2);
  node.keys.splice(middle+1);
  if (!node.isLeaf){
    // deal with links
    node.child.splice(middle+1);
  } 
  return node;
}

function increaseTreeDepth(tree, left, right, key) {
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

const atree = btree(3);
insert(atree, 1);
insert(atree, 2);
insert(atree, 3);
insert(atree, 4);
insert(atree, 5);
insert(atree, 6);
insert(atree, 7);
insert(atree, 8);
insert(atree, 9);

module.exports.btree = btree;
module.exports.insert = insert;
