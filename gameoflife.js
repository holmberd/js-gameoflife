/**
* TODO:
* - Add node.js support, export.module
* - Add render string in console function
* - Add color cell support, Cell { state: Bool, color: String }
* - Add arbitrary rulestring: http://www.conwaylife.com/wiki/List_of_Life-like_cellular_automata
* - Add arbitrary rulestring's tests
*/

/**
 * Game Of Life 2016/08/26
 *
 * Game Rules:
 * # Any live cell with fewer than two or more than three live neighbors dies.
 * # Any live cell with two or three live neighbors lives on to the nextgeneration.
 * # Any dead cell with exactly three live neighbors becomes a live cell.
 *
 * GameOfLife World Constructor 
 * Constructor: World()
 * @param {String} 
 * @return World {Object}
 *
 * Methods:
 * World.init(String)
 * World.getGeneration()
 * World.getRows()
 * World.getCols()
 * World.evolve()
 * World.print()
 * World.inBound(Location)
 * World.getCell(Location)

 * Example:
 * var world = new World();
 *
 * var board =  '......\n' +
                '***...\n' +
                '......\n' +
                '......\n' +
                '......\n' +
                '......\n';
 *
 * world.init(board);
 * world.evolve();
 * world.print();
 */

function World() {

  var rows = null,
      cols = null,
      worldGrid = [],
      generation = 0;

  this.init = function(str) {
    if (charError(str)) {
      throw new Error('String must only contain the following characters: [ ".", "*", "\n" ]');
    }
    else if (rowError(str)) {
      throw new Error('String rows must be of the same length.');
    } else {
      rows = getRows(str);
      cols = getCols(str);
      worldGrid = makeGrid(str);
    }
  };

  function Cell(state) {
    this.state = state;
  }

  function Location(row, col) {
    this.row = row;
    this.col = col;
  }

  this.getCell = function(location) {
    return worldGrid[location.row][location.col];
  };

  this.setCell = function(location, state) {
    worldGrid[location.row][location.col] = state;
  };

  this.getGeneration = function() {
    return generation;
  };

  this.getRows = function() {
    return rows;
  };

  this.getCols = function() {
    return cols;
  };

  this.inBounds = function(location) {
    if (location.row > rows || location.row < 0) return false;
    if (location.col > cols || location.col < 0) return false;
    return true;
  };

  this.toString = function() {
    var str = '';
    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        if (worldGrid[row][col].state) str += '*';
        else str += '.'; 
      }
      str += '\n';
    }
    return str;
  };

  this.evolve = function(){
    var grid = worldGrid;
    worldGrid = evolveGrid.call(this, grid);
    generation++;
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
    var cellLocation = new Location(rowIndex, colIndex);
    var aliveNeighbors = countNeighbors.call(this, cellLocation);
    if (cell.state) {
        if (aliveNeighbors < 2 || aliveNeighbors > 3) { 
          return new Cell(false);
        } else {  // 
          return new Cell(true);
        }
      } else {
        if (aliveNeighbors === 3) { 
          return new Cell(true);
        } else {
          return new Cell(false);
        }
      }
    }

  function countNeighbors(location) {
    var neighbors = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]], // neighbor cell positions to check
    count = 0,
    neighborLocation = null,
    neighborCell = null;

    for (var i = 0; i < neighbors.length; i++) {  // loop over cells and count alive neighbors
      neighborLocation = new Location(location.row + neighbors[i][0], location.col + neighbors[i][1]);
      if (this.inBounds(neighborLocation)) {
        neighborCell = this.getCell(neighborLocation);
        if (neighborCell.state) {
          count++;  
        }
      }
    }
    return count;
  }

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

  function getCols(str) {
    return str.indexOf('\n')-1;
  }

  function getRows(str) {
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

/********************************************************************/

var world = new World();

var board =
  '......\n' +
  '***...\n' +
  '......\n' +
  '......\n' +
  '......\n' +
  '......\n';

world.init(board);
console.log(world.toString());
world.evolve();
console.log(world.toString());

