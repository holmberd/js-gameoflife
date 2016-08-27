# js-gameoflife

## Game Of Life 2016/08/26
+ Supports Arbitrary World Rules: http://www.conwaylife.com/wiki/List_of_Life-like_cellular_automata

_ World Constructor:_
```
@constructor function World() - Represents a World.
@param {string} str - The board of the game.
@param {string} ruleString - The rules of the game.
@return World {object}
```

###Methods:
+ World.init(string, string)
+ World.getCell({ row: int, col: int })
+ World.setCell({ row: int, col: int })
+ World.Location(int, int)
+ World.getRules()
+ World.setRules(string)
+ World.getGeneration()
+ World.getRows()
+ World.getCols()
+ World.evolve()
+ World.toString()
+ World.inBound( { row: int, col: int })

###Example:

 ```
 var world = new World();
 var ruleString = '123/3';

 var board = '......\n' +
              '***...\n' +
              '......\n' +
              '......\n' +
              '......\n' +
              '......\n';

world.init(board, ruleString);
world.evolve();
console.log(world.toString());

$ > 
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
