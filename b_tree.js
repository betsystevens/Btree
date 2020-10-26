'use strict';

/*  
 *  JavaScript Implementation of a B tree, multi-way tree
 *  m - order of tree ≈ max number of children
 * 
 * nodes are split with left-bias, 
 *  - nodes that don't split evenly in two (after removing middle key)
 *  - the left side will have one more key than the right side
 *
 * */

function btree(m) {
  let order = m;
  let maxKeys = m-1;
  root = null;
  return {
    root: function() { return root; },
    setRoot: function(newRoot) { root = newRoot; return this},
    maxKeys: function() { return maxKeys; },
    isEmpty: function(){return (root === null)},
    exists: function(item, node = root){ if (root === null) return false;
      if (node.contains(item)) return true;
      if (node.isLeaf) return false; 
      return (this.exists(item, node.child[node.subTree(item)]));
    },
    
    find: function(item, node){
      if (root === null) return false;
      // return node that contains item or 
      //   the leaf node where item will be inserted
      if ((node.isLeaf) || (node.contains(item))) {
        return node;
      } else {
        let pos = node.subTree(item);
        return this.find(item, node.child[pos]);
      }
    },
    balance: function (node) {
      if (node.keyCount() > this.maxKeys()) {
        this.balance(split(this, node));
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
    midPoint: function() {
      // console.log(this.keys.length)
      return Math.floor(this.keys.length/2) },
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
    leafInsert: function (item) {
      this.keys.push(item); 
      this.keys.sort((a,b) => ((a<b) ? -1 : ((a>b) ? 1: 0)));
    },

  }
}

function insert(tree, item){
  if(tree.root() === null) {
    tree.setRoot(makeNode());
    tree.root().keys.push(item);
  } else {
    // get leaf to insert item into, unless already in tree
    let node = tree.find(item, tree.root());  
    if (!node.contains(item)) {
      node.leafInsert(item);
      // balance(tree, node);
      tree.balance(node);
    } else {
      console.log(`${item} already in tree`);
    }
  }
};

function balance(tree, node) {
  if (node.keyCount() > tree.maxKeys()) {
    balance(tree, split(tree, node));
  } 
}

function split(tree, node) {
  let [left, midKey, right] = separate(node);

  let parent = left.parent;
  // did we split the root?
  if (parent === null) { 
    increaseTreeDepth(tree, left, right, midKey);
    parent = tree.root();
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

function separate(node) {
  // newNode will hold right half of node 
  let middle = node.midPoint();
  let newNode = makeNode();
  newNode.keys = node.keys.splice(middle+1);
  let midKey = node.keys.pop()

  if (!node.isLeaf) {
    newNode.isLeaf = false;
    newNode.child = node.child.splice(middle + 1);
    newNode.child.forEach((e) => {
      e.parent = newNode;
    })
  }
  let parts = [node, midKey, newNode];
  return parts;
}

function increaseTreeDepth(tree, left, right, key) {
  let newRoot = makeNode();
  newRoot.parent === null;
  newRoot.isLeaf = false;
  tree.setRoot(newRoot);
  newRoot.keys.push(key);
  newRoot.child[0] = left;
  newRoot.child[1] = right;
  // parent of the just split nodes ≈≈ new root
  left.parent = newRoot;
  right.parent = newRoot;
}

function traverse() {
  let items = [];
  let list = '';
  return {
    inOrder : function(node){
      if (node.isLeaf) {
        node.keys.forEach((k) => { items.push(k) } );
        node.keys.forEach((k) => { list += k + ', ' } );
        return this;
      }
      else {
        // print left child then root
        for(let i = 0; i < node.keyCount(); i++) {
          this.inOrder(node.child[i])
          items.push(node.keys[i]);
          list += node.keys[i] + ',';
        }
        // print last right child
        this.inOrder(node.child[node.keyCount()]);
      }
      return this; 
    }, 
    toArray : function() {
      return items;
    },
    toList : function() {
      // remove trailing whitespace & comma
      return list.trim().slice(0,-1);
    }
  }
}
// const order = 4;
const tree = btree(3);
      insert(tree, 2);
      insert(tree, 3);
      insert(tree, 1);

module.exports.btree = btree;
module.exports.insert = insert;
module.exports.traverse = traverse;
