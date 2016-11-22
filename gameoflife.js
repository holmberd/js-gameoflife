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
   * @param {string} boardScheme
   * @param {string} rules
   * @return {World}
   */

  this.init = function(boardScheme, rules) {
    if (!_checkError(boardScheme)) {
      var _rows = _checkRows(boardScheme);
      var _cols = _checkCols(boardScheme);
      var _board = _makeBoard(boardScheme);
      var _rules = _makeRules(rules);
      return new World(_board, _rules, _rows, _cols);
    }
  };

  /**
   * If all rows are of equal length then return `true`.
   * @param {string} boardScheme
   * @returns {boolean}
   */

  function _rowError(boardScheme) {
    var rows = _getRows(boardScheme);
    return !rows.every(isEqualLength);
    function isEqualLength(row) {
      return rows[0].length === row.length;
    }
  }

  /**
   * If `string` contains no illegal characters then return `true`.
   * @param {string} boardScheme
   * @returns {boolean}
   */

  function _charError (boardScheme) {
    for (var i = 0; i < boardScheme.length; i++) {
      if (boardScheme[i] !== '\n' && boardScheme[i] !== '.' && boardScheme[i] !== '*') {
        return true;
      }
    }
    return false;
  }

  /**
   * Error handler, checks for `rowError` & `_charError`, if error returns `true`.
   * @param {string} boardScheme
   * @returns {error | boolean}
   */

  function _checkError(boardScheme) {
    if (_charError(boardScheme)) {
      throw new Error('String must only contain the following characters: [ ".", "*", "\n" ]');
    }
    else if (_rowError(boardScheme)) {
      throw new Error('String rows must be of the same length.');
    }
    return false;
  }

  /**
   * Creates the `Rules` from the set `rules`.
   * @param {string} rules
   * @returns {object}
   */

  function _makeRules(rules) {
    var rulesGroup = rules.split('/');
    return {
      survival: rulesGroup[0].split(''),
      born: rulesGroup[1].split('')
    };
  }

  /**
   * Takes a string and makes them into a `Board` of cells.
   * @param {string} boardScheme
   * @returns {object}
   */

  function _makeBoard(boardScheme) {
    var board = _getRows(boardScheme);
    return board.map(function(row) {
      return _convertRow(row);
    });
  }

  /**
   * Returns an array of rows.
   * @param {string} boardScheme
   * @returns {array}
   */

  function _getRows(boardScheme) {
    return boardScheme.split('\n').slice(0, -1);
  }

  /**
   * Helper function to `_makeBoard`.
   * @param {array} row
   * @returns {array}
   */

  function _convertRow(row) {
    var str = row.split('');
    return str.map(function(char) {
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
   * Returns the length of each `row` on the `Board`.
   * @param {string} boardScheme
   * @returns {number}
   */

  function _checkRows(boardScheme) {
    return _getRows(boardScheme).length;
  }

  /**
   * Return number of newlines in a `string`.
   * @param {string} boardScheme
   * @returns {number}
   */

  function _checkCols(boardScheme) {
    return boardScheme.indexOf('\n');
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
    return (location.row <= this.rows && location.row >= 0) && 
      (location.col <= this.cols && location.col >= 0);
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
   * Evolves a row in an array of rows.
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


