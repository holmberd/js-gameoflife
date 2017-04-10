## Game of Life
+ Supports Arbitrary World Rules: http://www.conwaylife.com/wiki/List_of_Life-like_cellular_automata

### Node.js (Install)
Requirements:

+ Node.js
+ npm (Node.js package manager)
```
npm install gameoflife-rulestring
```

### Usage:
```
var game = require('gameoflife-rulestring');

var rules = '23/3'; // B3/S23 - Conway's Life
var board =  '......\n' +
             '***...\n' +
             '......\n' +
             '......\n' +
             '......\n' +
             '......\n';
var world = game.init(board, rules);
world.evolve();
console.log(world.toString());
 
. * . . . .
. * . . . .
. * . . . .
. . . . . .
. . . . . .
. . . . . .
```

### Game of Life World Initializer

```
Initialises a World.
  @param {string} boardScheme
  @param {string} rules
  @return {World}
```

+ require('gameoflife-rulestring').init(boardScheme, rules)

### @Public API Methods:
+ World.board - [Getter]
+ World.rows - [Getter]
+ World.cols - [Getter]
+ World.rules - [Getter]
+ World.generation - [Getter]
+ World.aliveCount - [Getter]
+ World.getCell({Location})
+ World.setCell({Location}, {Cell})
+ World.evolve()
+ World.toString()
+ World.inBound({Location})

## License

Free to use and abuse under the MIT license.
http://www.opensource.org/licenses/mit-license.php
