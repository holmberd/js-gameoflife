# js-gameoflife

## Game of Life
+ Supports Arbitrary World Rules: http://www.conwaylife.com/wiki/List_of_Life-like_cellular_automata

###@Constructor
```
World - Represents a World.
@constructor
@return {object} World
```
###@typedef
```
@typedef {row: {number}, col: {number}} Location
```

###@Public API Methods:
+ World.init({string}, {string}) - Initializes the World with board and rules.
+ World.getCell({Location})
+ World.setCell({Location}, {object})
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
$ > var ruleString = '23/3'; (B3/S23 - Conway's Life)
 
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
