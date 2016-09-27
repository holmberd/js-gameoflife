# js-gameoflife

## Game of Life
+ Supports Arbitrary World Rules: http://www.conwaylife.com/wiki/List_of_Life-like_cellular_automata

```
function World() - Represents a World.
@constructor
@return World {object}
```

###Public API Methods:
+ World.init(string, ruleString)
+ World.getCell(location)
+ World.setCell(location, cell)
+ World.Location(row, col)
+ World.getRules()
+ World.getGeneration()
+ World.getAliveCount()
+ World.getRows()
+ World.getCols()
+ World.evolve()
+ World.toString()
+ World.inBound(location)

###Example:

```
$ > var world = new World();
$ > var ruleString = '123/3';
 
$ > var board = '......\n' +
             	'***...\n' +
             	'......\n' +
             	'......\n' +
             	'......\n' +
             	'......\n';
 
$ > world.init(board, ruleString);
$ > world.evolve();
$ > console.log(world.toString());
 
. * . . . .
. * . . . .
. * . . . .
. . . . . .
. . . . . .
. . . . . .
```

##License

Free to use and abuse under the MIT license.
http://www.opensource.org/licenses/mit-license.php
