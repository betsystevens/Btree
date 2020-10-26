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
    },

    increaseHeight: function (left, right, key) {
      let newRoot = makeNode();
      newRoot.parent === null;
      newRoot.isLeaf = false;
      this.setRoot(newRoot);
      newRoot.keys.push(key);
      newRoot.child[0] = left;
      newRoot.child[1] = right;
      // parent of the just split nodes ≈≈ new root
      left.parent = newRoot;
      right.parent = newRoot;
      return newRoot;
    }
  }
}

function makeNode() {
  return {
    isLeaf: true,
    parent: null, 
    keys: [],   // max: m-1
    child: [],  // max: m

    keyCount: function() { 
      return this.keys.length; 
    },
    midPoint: function() {
      return Math.floor(this.keys.length/2);
    },
    contains: function(item) { 
      return (this.keys.includes(item))
    },

    // returns index of child[] ≈≈ the subTree to search for item
    subTree: function(item){
      if(item < this.keys[0]) {
         return 0;
      } else {
        let index = this.keys.findIndex((e) => e > item);
        return (index === -1) ? this.keyCount() : index;
      } 
    },
    
    // insert item into leaf node, then sort
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

function insertPoint(node, key) {
  let index = node.keys.findIndex((e) => e > key);
  let pos = (index === -1) ? node.keyCount() : index;
  return pos;
}

function push(key, parent, left, right) {
  let pos = insertPoint(parent, key);
  parent.keys.splice(pos, 0, key);
  parent.child[pos] = left;
  parent.child.splice(pos+1, 0, right);
  right.parent = parent;
  return parent;
}

function split(tree, node) {
  let [left, midKey, right] = separate(node);

  let parent = left.parent;
  // did we split the root?
  if (parent === null) { 
    parent = tree.increaseHeight(left, right, midKey);
  } else {
    // push midKey into parent node, update links
    parent = push(midKey, parent, left, right);
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
  return [node, midKey, newNode];
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
        // visit left child, then root, then recurse
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

module.exports.btree = btree;
module.exports.insert = insert;
module.exports.traverse = traverse;
