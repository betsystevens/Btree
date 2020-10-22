const assert = require("chai").assert;
const expect = require("chai").expect;
const btree = require("../bt").btree;
const insert = require("../bt").insert;

describe('B tree tests - bt.js', function() {
  describe('test creating tree', function() {
    it('tests for empty tree', function() {
      let order = 5
      let minChild = Math.ceil(order/2);
      let tree = btree(order);
      assert.isObject(tree);
      assert.equal(tree.isEmpty(), true, 'tree is empty');
      expect(tree.root).to.be.null;
      assert.equal(tree.order, order, 'correct order');
      assert.equal(tree.maxKeys, order-1, 'max keys');
      assert.equal(tree.minChild, minChild , 'minChild');
      assert.equal(tree.minKeys, minChild-1 , 'minKeys');
    });
  });
  describe('test insertion into root, no splitting', function() {
    let tree = {};
    before(function(){
      const order = 4;
      tree = btree(order);
      insert(tree, 2);
      insert(tree, 3);
      insert(tree, 1);
    })
    it('test inserting 3 items', function(){
      assert.equal(tree.root.keys[0], 1, 'correct first item')
      assert.equal(tree.root.keys[1], 2, 'correct second item')       
      assert.equal(tree.root.keys[2], 3, 'correct third item')       
      assert.equal(tree.root.isLeaf, true, 'root node isLeaf')
      assert.equal(tree.root.keyCount(), 3, 'correct number of keys');
      // console.log(tree.root);
    });
    it('tests contains and exists values', function() {
      assert.equal(tree.root.contains(2), true, 'contains returns false')
      assert.equal(tree.root.contains(7), false, 'contains returns true')
      assert.equal(tree.exists(1), true, 'tree.exists item ');
      assert.equal(tree.exists(3), true, 'tree.exists item ');
      assert.equal(tree.exists(8), false, 'tree.exists not');
      // expect(() => node.compare(null)).to.throw('calls compare with null');
    });
  });
  describe('test 3 inserts -> splitting root', function() {
    let tree = {};
    before(function(){
      const order = 3;
      tree = btree(order);
      insert(tree, 7);
      insert(tree, 4);
      insert(tree, 2);
    })
    it('tests exists values', function() {
      assert.equal(tree.exists(2), true, 'tree.exists item ');
      assert.equal(tree.exists(7), true, 'tree.exists item ');
      assert.equal(tree.exists(3), false, 'tree.exists not');
      // expect(() => node.compare(null)).to.throw('calls compare with null');
    })
    it('tests root contents', function(){
      assert.equal(tree.root.keyCount(), 1, 'count keys in root');
      assert.equal(tree.root.isLeaf, false, 'root is not a leaf');
      assert.equal(tree.root.keys[0], 4, 'new root key');
      assert.equal(tree.root.child[0].isLeaf, true, 'child of root is a leaf');
      assert.equal(tree.root.child[0].keys[0], 2, 'left leaf');
      assert.equal(tree.root.child[1].isLeaf, true, 'other child of root is a leaf');
      assert.equal(tree.root.child[1].keys[0], 7, 'right leaf');
    });
  });
  describe('test 4 inserts -> splitting root', function() {
    let tree = {};
    before(function(){
      const order = 3;
      tree = btree(order);
      insert(tree, 7);
      insert(tree, 4);
      insert(tree, 2);
      insert(tree, 1);
    })
    it('tests root contents', function(){
      assert.equal(tree.root.keyCount(), 1, 'count keys in root');
      assert.equal(tree.root.isLeaf, false, 'root is not a leaf');
      assert.equal(tree.root.keys[0], 4, 'new root key');
    });
    it('tests root children contents', function(){
      assert.equal(tree.root.child[0].isLeaf, true, 'child of root is a leaf');
      assert.equal(tree.root.child[0].keys[0], 1, 'left leaf key 1');
      assert.equal(tree.root.child[0].keys[1], 2, 'left leaf key 2');
      assert.equal(tree.root.child[0].keyCount(), 2, 'left leaf key count');
      assert.equal(tree.root.child[1].isLeaf, true, 'other child of root is a leaf');
      assert.equal(tree.root.child[1].keys[0], 7, 'right leaf key');
      assert.equal(tree.root.child[1].keyCount(), 1, 'right leaf key count');
    });
   });
  describe('test 5 inserts -> splitting root', function() {
    let tree = {};
    before(function(){
      const order = 3;
      tree = btree(order);
      insert(tree, 7);
      insert(tree, 4);
      insert(tree, 2);
      insert(tree, 1);
      insert(tree, 8);
      // insert(tree, 5);
    })
    it('tests root contents and child contents', function(){
      assert.equal(tree.root.keyCount(), 1, 'count keys in root');
      assert.equal(tree.root.isLeaf, false, 'root is not a leaf');
      assert.equal(tree.root.keys[0], 4, 'new root key');
      assert.equal(tree.root.child[0].isLeaf, true, 'child of root is a leaf');
      assert.equal(tree.root.child[0].keys[0], 1, 'left leaf key 1');
      assert.equal(tree.root.child[0].keys[1], 2, 'left leaf key 2');
      assert.equal(tree.root.child[1].isLeaf, true, 'other child of root is a leaf');
      assert.equal(tree.root.child[1].keys[0], 7, 'right leaf key 1');
      assert.equal(tree.root.child[1].keys[1], 8, 'right leaf key 2');
    });
   });
  describe('unit tests', function () {
    let tree = {};
    before(function(){

    })
    it('test blah blah', function() {
      // asserts and equals and stuff...
    })
  })
  describe('test 6 inserts -> splitting a leaf - not root', function() {
    let tree = {};
    before(function(){
      const order = 3;
      tree = btree(order);
      insert(tree, 7);
      insert(tree, 4);
      insert(tree, 2);
      insert(tree, 1);
      insert(tree, 8);
      insert(tree, 9);
    })
    it('tests root contents and child contents', function(){
      assert.equal(tree.root.keyCount(), 2, 'count keys in root');
      assert.equal(tree.root.isLeaf, false, 'root is not a leaf');
      assert.equal(tree.root.keys[0], 4, 'root key at 0');
      assert.equal(tree.root.keys[1], 8, 'root key at 1');
      assert.equal(tree.root.child[0].isLeaf, true, 'child0 of root is a leaf');
      assert.equal(tree.root.child[1].isLeaf, true, 'child1 of root is a leaf');
      assert.equal(tree.root.child[2].isLeaf, true, 'child2 of root is a leaf');
      assert.equal(tree.root.child[0].keys[0], 1, 'left child key0');
      assert.equal(tree.root.child[0].keys[1], 2, 'left child key1');
      assert.equal(tree.root.child[1].keys[0], 7, 'middle child key0');
      assert.equal(tree.root.child[2].keys[0], 9, 'right child key0');
    });
    it('tests middle leaf insert', function(){
      insert(tree, 5);
      assert.equal(tree.root.child[1].keys[0], 5, 'middle child key0');
      assert.equal(tree.root.child[1].keys[1], 7, 'middle child key1');
    });
    it('tests middle leaf insert, push to root, then split root', function(){
      // insert(tree, 6);
      // need 
    });
  });
  describe('test left leaf split and push to root', function() {
    let tree = {};
    before(function(){
      const order = 3;
      tree = btree(order);
      insert(tree, 7);
      insert(tree, 4);
      insert(tree, 2);
      insert(tree, 1);
      insert(tree, 3);
    });
    it('tests left leaf split, push', function(){
      assert.equal(tree.root.keyCount(), 2, 'count keys in root');
      assert.equal(tree.root.isLeaf, false, 'root is not a leaf');
      assert.equal(tree.root.keys[0], 2, 'root key at 0');
      assert.equal(tree.root.keys[1], 4, 'root key at 1');
      assert.equal(tree.root.child[0].keys[0], 1, 'left child key0');
      assert.equal(tree.root.child[1].keys[0], 3, 'middle child key0');
      assert.equal(tree.root.child[2].keys[0], 7, 'right child key0');
    });
  });
});