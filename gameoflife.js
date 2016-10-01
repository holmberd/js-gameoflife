/**
* Copyright(c) 2016 Dag Holmberg
* MIT Licensed
* 
* Game Of Life
* Supports Arbitrary World Rules: http://www.conwaylife.com/wiki/List_of_Life-like_cellular_automata
*
* #Game-of-Life World Initializer
* gameoflife.init({string}, {string}) - Initializes the World with board and rules.
*
* #World public API:
* World.board - [Getter]
* World.rows - [Getter]
* World.cols - [Getter]
* World.rules - [Getter]
* World.generation - [Getter]
* World.aliveCount - [Getter]
* World.getCell({Location})
* World.setCell({Location}, {Cell})
* World.evolve()
* World.toString()
* World.inBound({Location})
*/

/**
* #Module example usage
*
* var game = require('./gameoflife.js');
* var rules= '23/3'; (B3/S23 - Conway's Life)
* var board =  '......\n' +
              '***...\n' +
              '......\n' +
              '......\n' +
              '......\n' +
              '......\n';
* var world = game.init(board, rules);
* world.evolve();
* console.log(world.toString());
*/

/*jslint node: true */

'use strict';

/**
* Module dependencies.
*/

var World = require('./gameoflifetypes.js').World;
var Cell = require('./gameoflifetypes.js').Cell;
var Location = require('./gameoflifetypes.js').Location;

/**
* Export `GameOfLife`.
*/

module.exports = GameOfLife();

/**
* Represents the module.
*/

function GameOfLife() {

  /**
   * World prototype.
   */

  var world = World.prototype;

  /**
   * Initialize a new `GameOfLife`.
   */
  
  if (!(this instanceof GameOfLife)) return new GameOfLife();

  /**
   * Initialises a `World`.
   * @param {string} str
   * @param {string} ruleString
   * @return {World}
   */

  this.init = function(str, ruleString) {
    if (!_checkError(str)) {
      var rows = _checkRows(str);
      var cols = _checkCols(str);
      var board = _makeBoard(str);
      var rules = _makeRules(ruleString);
      return new World(board, rules, rows, cols);
    }
  };

  /**
   * If all rows are of equal length then return `true`.
   * @param {string} str
   * @returns {boolean}
   */

  function _rowError(str) {
    var rowsArray = _getRowsArray(str);
    return !rowsArray.every(isEqualLength);
    function isEqualLength(row) {
      return rowsArray[0].length === row.length;
    }
  }

  /**
   * If `string` contains no illegal characters then return `true`.
   * @param {string} str
   * @returns {boolean}
   */

  function _charError (str) {
    for (var i = 0; i < str.length; i++) {
      if (str[i] !== '\n' && str[i] !== '.' && str[i] !== '*') {
        return true;
      }
    }
    return false;
  }

  /**
   * Error handler, checks for `rowError` & `_charError`, if error returns `true`.
   * @param {string} str
   * @returns {error | boolean}
   */

  function _checkError(str) {
    if (_charError(str)) {
      throw new Error('String must only contain the following characters: [ ".", "*", "\n" ]');
    }
    else if (_rowError(str)) {
      throw new Error('String rows must be of the same length.');
    }
    return false;
  }

  /**
   * Creates the `Rules` from `ruleString`.
   * @param {string} ruleString
   * @returns {object}
   */

  function _makeRules(ruleString) {
    var rulesArr = ruleString.split('/');
    return {
      survival: rulesArr[0].split(''),
      born: rulesArr[1].split('')
    };
  }

  /**
   * Takes a string and makes them into a `Board` of cells.
   * @param {string} str
   * @returns {object}
   */

  function _makeBoard(str) {
    var board = _getRowsArray(str);
    return board.map(function(row) {
      return _convertRow(row);
    });
  }

  /**
   * Returns an array of rows.
   * @param {string} str
   * @returns {array}
   */

  function _getRowsArray(str) {
    return str.split('\n').slice(0, -1);
  }

  /**
   * Helper function to `_makeBoard`.
   * @param {array} row
   * @returns {array}
   */

  function _convertRow(row) {
    var rowArr = row.split('');
    return rowArr.map(function(char) {
      return _convertChar(char);
    });
  }

  /**
   * Helper function to `_makeBoard`.
   * @param {string} char
   * @returns {Cell}
   */

  function _convertChar(char) {
    if (char === '.') return new Cell(false);
    else {
      return new Cell(true);
    } 
  }

  /**
   * Returns length of each `rowsArray`.
   * @param {string} str
   * @returns {number}
   */

  function _checkRows(str) {
    return _getRowsArray(str).length;
  }

  /**
   * Return number of newlines in a `string`.
   * @param {string} str
   * @returns {number}
   */

  function _checkCols(str) {
    return str.indexOf('\n');
  }

  /**
  * Returns a `Cell` from a `Location`.
  * @public
  * @param {Location} location
  * @return {Cell}
  */

  world.getCell = function(location) {
    return this.board[location.row][location.col];
  };

  /**
   * Sets a cell's `state` given a `Location`.
   * @public
   * @param {Location} location
   * @param {boolean} state
   * @return {Cell}
   */

  world.setCell = function(location, state) {
    this.board[location.row][location.col] = new Cell(state);
    return this;
  };

  /**
   * If a `Location` is inside the bounds of the `Board` return `true`.
   * @public
   * @param {Location} location
   * @return {boolean}
   */

  world.inBounds = function(location) {
    if (location.row > (this.rows - 1) || location.row < 0) return false;
    if (location.col > (this.cols - 1) || location.col < 0) return false;
    return true;
  };

  /**
   * Evolves the current `World` state one `generation` using the rules of the game.
   * @public
   * @return {object}
   */

  world.evolve = function(){
    var board = this.board;
    var generation = this.generation;
    this.setBoard = _evolveBoard.call(this, board);
    this.setGeneration = ++generation;
    return this;
  };

  /**
   * Converts the current `Board` to a `string`.
   * @public
   * @return {string}
   */

  world.toString = function() {
    var str = '';
    for (var row = 0; row < this.rows; row++) {
      for (var col = 0; col < this.cols; col++) {
        if (this.board[row][col].state) str += '*';
        else str += '.'; 
      }
      str += '\n';
    }
    return str;
  };

  /**
   * Evolves the current `Board` state.
   * @param {array} board
   * @return {array}
   */

  function _evolveBoard(board) {
    return board.map(function(row, rowIndex) {
      return _evolveRow.call(this, rowIndex, row); 
    }, this);
  }

  /**
   * Evolves a row in the array of rows.
   * @param {number} rowIndex
   * @param {array} row
   * @return {array}
   */

  function _evolveRow(rowIndex, row) {
    return row.map(function(cell, colIndex) {
      return _evolveCell.call(this, rowIndex, colIndex, cell);
    }, this);
  }

  /**
   * Evolves a `Cell` on the `Board`.
   * @param {number} rowIndex
   * @param {number} colIndex
   * @param {Cell} cell
   * @return {Cell}
   */

  function _evolveCell(rowIndex, colIndex, cell) {
    var cellLocation = new Location(rowIndex, colIndex);
    var aliveNeighbours = _countNeighbours.call(this, cellLocation);
    return _onRules.call(this, cell, aliveNeighbours);
  }

  /**
   * Returns the number of alive `Cell` neighbours for a given `Location`.
   * @param {Location} location
   * @return {number}
   */

  function _countNeighbours(location) {
    // Neighbour cell positions to loop over.
    var neighbours = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]],
    count = 0,
    neighbourLocation = null,
    neighbourCell = null;

    // Loop over cells and count alive neighbours
    for (var i = 0; i < neighbours.length; i++) {
      neighbourLocation = new Location(location.row + neighbours[i][0], location.col + neighbours[i][1]);
      if (this.inBounds(neighbourLocation)) {
        neighbourCell = this.getCell(neighbourLocation);
        if (neighbourCell.state) {
          count++;  
        }
      }
    }
    return count;
  }

  /**
   * Evolves a `Cell` using the rules of the `World`.
   * @param {Cell} cell
   * @param {number} aliveNeighbours
   * @return {Cell}
   */

  function _onRules(cell, aliveNeighbours) {
    var rules = this.rules;

    // If `Cell` is Alive
    if (cell.state) {
      for (var i = 0; i < rules.survival.length; i++) {
        if (Number(rules.survival[i]) === aliveNeighbours) {
          return new Cell(true);
        }
      }
      return new Cell(false);
      // Else if `Cell` is Dead
    } else {
      for (var n = 0; n < rules.born.length; n++) {
        if (Number(rules.born[n]) === aliveNeighbours) {
          return new Cell(true);
        }
      }
      return new Cell(false);
    }
  }

}


