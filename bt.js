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

/*
  tree = btree(4)
  tree.insert(3)
  tree.order // returns order
  tree.maxKeys // returns maxKeys
  tree.traverse.array()
  tree.traverse.string()
  tree.traverse.log()
*/

function btree(m) {
  return {
    root: null,
    order: m,
    maxKeys: m-1,
    minChild: Math.ceil(m/2),
    minKeys: Math.ceil(m/2)-1, isEmpty: function(){return (this.root === null)}, 
    exists: function(item, node=this.root){ if (this.root === null) return false;
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
    // insert item into node then sort
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
    } else {
      console.log(`${item} already in tree`);
    }
  }
};

function balance(tree, node) {
  if (node.keyCount() > tree.maxKeys) {
    balance(tree, split(tree, node));
  } 
}

function split(tree, node) {
  // node is split in half: left and right
  let right = splitRight(node);
  let left = splitLeft(node);

  // key to push into parent node 
  let midKey = left.keys.pop();

  let parent = left.parent;
  // did we split the root?
  if (parent === null) { 
    increaseTreeDepth(tree, left, right, midKey);
    parent = tree.root;
  } else {
    // push midKey into parent node, update links
    let index = parent.keys.findIndex((e) => e > midKey);
    let pos = (index === -1) ? parent.keyCount() : index;
    parent.keys.splice(pos, 0, midKey);
    parent.child[pos] = left;
    parent.child.splice(pos+1, 0, right);
    right.parent = parent;
  }
  return parent;
}
function splitRight(node) {
  let middle = Math.floor(node.keys.length/2) + 1;
  let newNode = makeNode();
  // move right half of node into the new node
  newNode.keys = node.keys.slice(middle);
  if (!node.isLeaf) {
    newNode.isLeaf = false;
    // node has children, add them to newNode 
    newNode.child = node.child.slice(middle);
    newNode.child.forEach((e) => {
      e.parent = newNode;
    })
  }
  return newNode;
}
function splitLeft(node) {
  let middle = Math.floor(node.keys.length/2);
  node.keys.splice(middle+1);
  if (!node.isLeaf){
    // node has children, remove right half
    node.child.splice(middle+1);
  } 
  return node;
}

function increaseTreeDepth(tree, left, right, key) {
  let newRoot = makeNode();
  newRoot.parent === null;
  newRoot.isLeaf = false;
  tree.root = newRoot;
  newRoot.keys.push(key);
  newRoot.child[0] = left;
  newRoot.child[1] = right;
  // parent of the just split nodes ≈≈ new root
  left.parent = newRoot;
  right.parent = newRoot;
}

inOrder.str = '';
inOrder.a = [];
function inOrder(node) {
  if (node.isLeaf) {
    // node.keys.forEach((k) => { inOrder.str += k + ',' } );
    node.keys.forEach((k) => { inOrder.a.push(k) } );
    return;
  }
  else {
    // print left child then root
    for(let i = 0; i < node.keyCount(); i++) {
      inOrder(node.child[i])
      // inOrder.str += node.keys[i] + ',';
      inOrder.a.push(node.keys[i]);
    }
    // print last right child
    inOrder(node.child[node.keyCount()]);
  }
  // return inOrder.str.slice(0,-1);
  return inOrder.a;

}


module.exports.btree = btree;
module.exports.insert = insert;
module.exports.inOrder = inOrder;
