# js-gameoflife

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
