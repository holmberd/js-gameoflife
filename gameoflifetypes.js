/**
* Copyright(c) 2016 Dag Holmberg
* MIT Licensed
* 
* The types used to represent the world state in the Game of Life.
*
*/

/*jslint node: true */

'use strict';

/**
* Export types.
*/

module.exports = {

/**
 * Represents the `World`.
 * @constructor
 * @param {object} board - Representation of the `Board` on which the Game of Life unfolds.
 * @param {object} rules - Determines if a `Cell` lives or dies.
 * @param {object} rows - Number of rows of the `Board`.
 * @param {object} cols - Number of columns of the `Board`.
 * @return {object}
 */

 World: function(board, rules, rows, cols) {
   var _board = board,
   _rules = rules,
   _generation = 0,
   _rows = rows,
   _cols = cols;

   Object.defineProperty(this, 'generation', {
    get: function() { return _generation; },
    enumerable: true,
  });

   Object.defineProperty(this, 'board', {
    get: function() { return _board; },
    enumerable: true,
  });

   Object.defineProperty(this, 'rules', {
    get: function() { return _rules; },
    enumerable: true,
  });

   Object.defineProperty(this, 'rows', {
    get: function() { return _rows; },
    enumerable: true
  });

   Object.defineProperty(this, 'cols', {
    get: function() { return _cols; },
    enumerable: true
  });

   Object.defineProperty(this, 'aliveCount', {
    get: function() {
     var count = 0;
     for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
       if (this.board[row][col].state) count++;
     }
   }
   return count;
 },
 enumerable: true
});

   Object.defineProperty(this, 'setBoard', {
    set: function(value) { _board = value; },
  });

   Object.defineProperty(this, 'setGeneration', {
    set: function(value) { _generation = value; },
  });

   return this;
 },

/**
 * Represents a single `Cell` on the  `Board`.
 * @constructor
 * @param {boolean} state - State of a `Cell` (Alive | Dead)
 * @return {Cell}
 */

 Cell: function(state) {
   Object.defineProperty(this, 'state', {
    value: state,
    writable: false,
    enumerable: true
  });
   return this;
 },

/**
 * Represents a `Location` on the `Board`.
 * @constructor
 * @param {number} row - Row in the array of rows.
 * @param {number} col - Column in the array of columns.
 * @return {Location}
 */

 Location: function(row, col) {
   Object.defineProperty(this, 'row', {
     value: row,
     writable: false,
     enumerable: true,
   });
   Object.defineProperty(this, 'col', {
     value: col,
     writable: false,
     enumerable: true,
   });
   return this;
 }

};