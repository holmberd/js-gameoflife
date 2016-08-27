/**
 * Game Of Life 2016/08/26
 * Supports Arbitrary World Rules: http://www.conwaylife.com/wiki/List_of_Life-like_cellular_automata
 *
 * Game-Of-Life World Constructor 
 * Constructor: World()
 * @param {String} 
 * @return World {Object}
 *
 * Methods:
 *
 * World.init(String, String)
 * World.getCell({ row: Int, col: Int })
 * World.setCell({ row: Int, col: Int })
 * World.Location(Int, Int)
 * World.getRules()
 * World.setRules(String)
 * World.getGeneration()
 * World.getRows()
 * World.getCols()
 * World.evolve()
 * World.toString()
 * World.inBound( { row: Int, col: Int })

 * Example:
 *
 * var world = new World();
 * var ruleString = '123/3';
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

function World() {
  
  var rules = null;
  var board = {
    grid: [],
    rows: null,
    cols: null,
    generation: 0,
  };

  this.init = function(str, rulestring) {
    if (charError(str)) {
      throw new Error('String must only contain the following characters: [ ".", "*", "\n" ]');
    }
    else if (rowError(str)) {
      throw new Error('String rows must be of the same length.');
    } else {
      board.rows = checkRows(str);
      board.cols = checkCols(str);
      board.grid = makeGrid(str);
      this.setRules(rulestring);
    }
  };

  function Cell(state) {
    this.state = state;
  }

  this.Location = function(row, col) {
    this.row = row;
    this.col = col;
  };

  this.getCell = function(location) {
    return board.grid[location.row][location.col];
  };

  this.setCell = function(location, state) {
    board.grid[location.row][location.col] = state;
  };

  this.getGeneration = function() {
    return board.generation;
  };

  this.getRows = function() {
    return board.rows;
  };

  this.getCols = function() {
    return board.cols;
  };

  this.inBounds = function(location) {
    if (location.row > board.rows || location.row < 0) return false;
    if (location.col > board.cols || location.col < 0) return false;
    return true;
  };

  this.toString = function() {
    var str = '';
    for (var row = 0; row < board.rows; row++) {
      for (var col = 0; col < board.cols; col++) {
        if (board.grid[row][col].state) str += '*';
        else str += '.'; 
      }
      str += '\n';
    }
    return str;
  };

  this.evolve = function(){
    var grid = board.grid;
    board.grid = evolveGrid.call(this, grid);
    board.generation++;
  };

  function evolveGrid(grid) {
    return grid.map(function(row, rowIndex) {
      return evolveRow.call(this, grid, rowIndex, row); 
    }, this);
  }

  function evolveRow(grid, rowIndex, row) {
    return row.map(function(cell, colIndex) {
      return evolveCell.call(this, grid, rowIndex, colIndex, cell);
    }, this);
  }

  function evolveCell(grid, rowIndex, colIndex, cell) {
    var cellLocation = new this.Location(rowIndex, colIndex);
    var aliveNeighbours = countNeighbours.call(this, cellLocation);
    return onRules.call(this, cell, aliveNeighbours);
  }

  function onRules(cell, aliveNeighbours) {
    var rules = this.getRules();
    if (cell.state) {
      for (var i = 0; i < rules.survival.length; i++) {
        if (Number(rules.survival[i]) === aliveNeighbours) {
          return new Cell(true);
        }
      }
      return new Cell(false);
    } else {
      for (var n = 0; n < rules.born.length; n++) {
        if (Number(rules.born[n]) === aliveNeighbours) {
          return new Cell(true);
        }
      }
      return new Cell(false);
    }
  }

  function countNeighbours(location) {
    var neighbours = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]], // neighbour cell positions to check
    count = 0,
    neighbourLocation = null,
    neighbourCell = null;

    for (var i = 0; i < neighbours.length; i++) {  // loop over cells and count alive neighbours
      neighbourLocation = new this.Location(location.row + neighbours[i][0], location.col + neighbours[i][1]);
      if (this.inBounds(neighbourLocation)) {
        neighbourCell = this.getCell(neighbourLocation);
        if (neighbourCell.state) {
          count++;  
        }
      }
    }
    return count;
  }

  this.setRules = function(ruleString) {
    var rulesArr = ruleString.split('/');
    rules = {
      survival: rulesArr[0].split(''),
      born: rulesArr[1].split('')
    };
  };

  this.getRules = function() {
    return rules;
  };

  function makeGrid(str) {
    var gridArr = getRowsArray(str);
    return gridArr.map(function(row) {
      return convertRow(row);
    }, this);
  }

  function convertRow(row) {
    var rowArr = row.split('');
    return rowArr.map(function(char) {
      return convertChar(char);
    }, this);
  }

  function convertChar(char) {
    if (char === '.') return new Cell(false);
    else return new Cell(true);
  }

  function checkCols(str) {
    return str.indexOf('\n')-1;
  }

  function checkRows(str) {
    return getRowsArray(str).length - 1;
  }

  function getRowsArray(str) {
    return str.split('\n').slice(0, -1);
  }

  function rowError(str) {
    var rowsArray = getRowsArray(str);
    return !rowsArray.every(isEqualLength);
    function isEqualLength(row) {
      return rowsArray[0].length === row.length;
    }
  }
  
  function charError (str) {
    for (var i = 0; i < str.length; i++) {
      if (str[i] !== '\n' && str[i] !== '.' && str[i] !== '*') {
        return true;
      }
    }
    return false;
  }

}

//module.exports = World;
