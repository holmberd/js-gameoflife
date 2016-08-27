# js-gameoflife

## Game Of Life 2016/08/26
*Supports Arbitrary World Rules: http://www.conwaylife.com/wiki/List_of_Life-like_cellular_automata

_Game-Of-Life World Constructor_
```
Constructor: World()
@param {String} 
@return World {Object}
```

_Methods_:

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

 _Example_:

 ```
 var world = new World();
 var ruleString = '123/3';

 var board =  '......\n' +
              '***...\n' +
              '......\n' +
              '......\n' +
              '......\n' +
              '......\n';

world.init(board, ruleString);
world.evolve();
world.toString();
```

##License

Free to use and abuse under the MIT license.
http://www.opensource.org/licenses/mit-license.php
