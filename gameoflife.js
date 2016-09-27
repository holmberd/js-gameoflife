/**
 * Copyright(c) 2016 Dag Holmberg
 * MIT Licensed
 * 
 * Game Of Life
 * Supports Arbitrary World Rules: http://www.conwaylife.com/wiki/List_of_Life-like_cellular_automata
 *
 * Game-of-Life World Constructor 
 * function World() - Represents a World.
 * @constructor
 * @return World {object}
 *
 * @puplic API Methods:
 *
 * World.init(board, ruleString)
 * World.getCell(location)
 * World.setCell(location, cell)
 * World.getRules()
 * World.getGeneration()
 * World.getAliveCount()
 * World.getRows()
 * World.getCols()
 * World.evolve()
 * World.toString()
 * World.inBound(location)

 * Example:
 *
 * var world = new World();
 * var ruleString = '23/3'; (B3/S23 - Conway's Life, or try B3/S1234 - Mazectric)
 * var board =  '......\n' +
                '***...\n' +
                '......\n' +
                '......\n' +
                '......\n' +
                '......\n';
 *
 * world.init(board, ruleString);
 * world.evolve();
 * world.toString();
 *
 */

/**
 * Represents a World.
 * @constructor
 * @return {object} World 
 */
function World() {

/**
 * @protected - Stores the `world` game rules. 
 * @typedef {object} rules
 * @property {string} survival - Represents rules for `cell` survival.
 * @property {string} born - Represents rules for `cell` creation.
 */
  var _rules = {}; 

/**
 * A complete `board` representing the `world` state.
 * @typedef {Object} board
 * @property {array} grid - Container for all the cells in the `world`.
 * @property {number} row - Number of rows on the `board`.
 * @property {number} cols - Number of columns on the `board`.
 * @property {number} generation - Number of times the `world` has evolved.
 * @property {number} aliveCount - Number of alive cells in the `world`.
 */
  var _board = {
    grid: [],
    rows: null,
    cols: null,
    generation: 0,
    aliveCount: 0
  };

/**
 * Initializes the World with board and rules.
 * @public
 * @param {string} str - The board of the game.
 * @param {string} ruleString - The rules of the game.
 * @return {object} World
 */
  this.init = function(str, ruleString) {
    if (!_checkError(str)) {
      _board.rows = _checkRows(str);
      _board.cols = _checkCols(str);
      _board.grid = _createGrid(str);
      _setRules(_createRules(ruleString));
      console.log(_rules);
    }
    return this;
  };

/**
 * Represents a Cell.
 * @constructor
 * @return {object} Cell
 */
  function Cell(state) {
    this.state = state;
    return this;
  }

/**
 * Represents a Location.
 * @constructor
 * @param {number} row 
 * @param {number} col
 * @return {object} Location
 */
  function Location(row, col) {
    this.row = row;
    this.col = col;
    return this;
  }

/**
 * Returns a `Cell` from a given `location`.
 * @public
 * @param {object} location - ({ row: {number}, col: {number} }) 
 * @return {object} Cell
 */
  this.getCell = function(location) {
    return _board.grid[location.row][location.col];
  };

/**
 * Set a cells `state` at a given `location`.
 * @public
 * @param {object} location - ({ row: {number}, col: {number} })
 * @param {boolean} state
 */
  this.setCell = function(location, state) {
    _board.grid[location.row][location.col] = state;
  };

/**
 * Returns the world's current `generation`.
 * @public
 * @return {number} board.generation
 */
  this.getGeneration = function() {
    return _board.generation;
  };

/**
 * Returns number of alive cells in the `world`.
 * @public
 * @return {number} board.aliveCount
 */
  this.getAliveCount = function() {
    return _board.aliveCount;
  };

/**
 * Returns number of rows on the `board`.
 * @public
 * @return {number} board.rows
 */
  this.getRows = function() {
    return _board.rows;
  };

/**
 * Returns number of columns on the `board`.
 * @public
 * @return {number} board.cols
 */
  this.getCols = function() {
    return _board.cols;
  };

/**
 * If `location` is inside the bounds of the `board` return `true`.
 * @public
 * @param {object} location - { row: {number}, col: {number} }
 * @return {boolean}
 */
  this.inBounds = function(location) {
    if (location.row > (_board.rows - 1) || location.row < 0) return false;
    if (location.col > (_board.cols - 1) || location.col < 0) return false;
    return true;
  };

/**
 * Converts the current `board` to a `string`.
 * @public
 * @return {string}
 */
  this.toString = function() {
    var str = '';
    for (var row = 0; row < _board.rows; row++) {
      for (var col = 0; col < _board.cols; col++) {
        if (_board.grid[row][col].state) str += '*';
        else str += '.'; 
      }
      str += '\n';
    }
    return str;
  };

/**
 * Evolves the current `world` state one `generation`.
 * @public
 * @return {object} World
 */
  this.evolve = function(){
    var grid = _board.grid;
    _board.grid = _evolveGrid.call(this, grid);
    _board.generation++;
    return this;
  };

/**
 * Evolves the current `grid` state.
 * @protected
 * @param {array} grid
 * @return {array} grid
 */
  function _evolveGrid(grid) {
    return grid.map(function(row, rowIndex) {
      return _evolveRow.call(this, grid, rowIndex, row); 
    }, this);
  }

/**
 * Evolves a row in the current `grid`.
 * @protected
 * @param {array} grid
 * @param {number} rowIndex
 * @param {array} row
 * @return {array}
 */
  function _evolveRow(grid, rowIndex, row) {
    return row.map(function(cell, colIndex) {
      return _evolveCell.call(this, grid, rowIndex, colIndex, cell);
    }, this);
  }

/**
 * Evolves a `Cell` in the `grid`.
 * @protected
 * @param {array} grid
 * @param {number} rowIndex
 * @param {number} colIndex
 * @param {object} cell
 * @return {object} Cell
 */
  function _evolveCell(grid, rowIndex, colIndex, cell) {
    var cellLocation = new Location(rowIndex, colIndex);
    var aliveNeighbours = _countNeighbours.call(this, cellLocation);
    return _onRules.call(this, cell, aliveNeighbours);
  }

/**
 * Evolves a `Cell` according to the set `world` rules.
 * @protected
 * @param {object} cell
 * @param {number} aliveNeighbours
 * @return {object} Cell
 */
  function _onRules(cell, aliveNeighbours) {
    var rules = this.getRules();
    if (cell.state) {
      for (var i = 0; i < rules.survival.length; i++) {
        if (Number(rules.survival[i]) === aliveNeighbours) {
          _board.aliveCount++;
          return new Cell(true);
        }
      }
      _board.aliveCount--;
      return new Cell(false);
    } else {
      for (var n = 0; n < rules.born.length; n++) {
        if (Number(rules.born[n]) === aliveNeighbours) {
          _board.aliveCount++;
          return new Cell(true);
        }
      }
      return new Cell(false);
    }
  }

/**
 * Returns the number of alive `Cell` neighbours for a given `Location`.
 * @protected
 * @param {object} location
 * @return {number}
 */
  function _countNeighbours(location) {
    var neighbours = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]], // neighbour cell positions to check
    count = 0,
    neighbourLocation = null,
    neighbourCell = null;

    for (var i = 0; i < neighbours.length; i++) {  // loop over cells and count alive neighbours
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
 * Creates `rules` type from `ruleString`.
 * @protected
 * @param {string} ruleString
 * @returns {object} rules
 */
  function _createRules(ruleString) {
    var rulesArr = ruleString.split('/');
    return {
      survival: rulesArr[0].split(''),
      born: rulesArr[1].split('')
    };
  }

/**
 * Helper function for setting `rules`.
 * @protected
 * @param {object} rules
 * @returns {object} rules
 */
  function _setRules(rules) {
    _rules = rules;
    return _rules;
  }

/**
 * Get game `rules`
 * @public
 * @returns {object} rules
 */
  this.getRules = function() {
    return _rules;
  };

/**
 * Helper function to create a `grid` from `string`.
 * @protected
 * @param {string} str
 * @returns {array} grid
 */
  function _createGrid(str) {
    var gridArr = _getRowsArray(str);
    return gridArr.map(function(row) {
      return _convertRow(row);
    }, this);
  }

/**
 * Helper function to `_createGrid`.
 * @protected
 * @param {array} row
 * @returns {array}
 */
  function _convertRow(row) {
    var rowArr = row.split('');
    return rowArr.map(function(char) {
      return _convertChar(char);
    }, this);
  }

/**
 * Helper function to `_createGrid`.
 * @protected
 * @param {string} char
 * @returns {object} Cell
 */
  function _convertChar(char) {
    if (char === '.') return new Cell(false);
    else return new Cell(true);
  }

/**
 * Return number of newlines in a `string`.
 * @protected
 * @param {string} str
 * @returns {number}
 */
  function _checkCols(str) {
    return str.indexOf('\n');
  }

/**
 * Returns length of each `rowsArray`.
 * @protected
 * @param {string} str
 * @returns {number}
 */
  function _checkRows(str) {
    return _getRowsArray(str).length;
  }

/**
 * Returns an `array` containing each row.
 * @protected
 * @param {string} str
 * @returns {array}
 */
  function _getRowsArray(str) {
    return str.split('\n').slice(0, -1);
  }

/**
 * If all rows are of equal length then return `true`.
 * @protected
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
 * @protected
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
 * @protected
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

  return this;
}

module.exports = World;


