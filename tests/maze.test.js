import { GameMap, mazeVal } from 'maze'


describe('GameMap', () => {
   const invalidTemplateExamples = [
      undefined,
      [],
      [[]],
      [[{}],[]],
      [[{val: 1},{val: 1},{val: 1},{val: 1},{val: 1}]],
      [
         [{val: 1},{val: 1},{val: 1},{val: 1},{val: 1}],
         [{val: 1},{val: 1},{val: 1},{val: 1}]
      ],
   ]
   for (let ex of invalidTemplateExamples) {
      describe(`when created with invalid template ${ex}`, () => {
         it('throws error', () => {
            expect(()=> new GameMap(ex) ).toThrow()
         })
      })
   }
   describe('when two gamemaps created with same game template', () => {
      const template = [
         [{val: 100},{val: 200}],
         [{val: 300},{val: 400}]
      ]
      var gm1
      var gm2
      beforeEach (()=>{
         gm1 = new GameMap(template)
         gm2 = new GameMap(template)
      })
      describe('when modifying the first gameMap', ()=> {
         beforeEach(()=>{
            gm1.setValAtPosition(999, 0, 0)
         })
         it('sets a new value on gm1', ()=> {
            expect(gm1.getValAtPosition(0,0)).toEqual(999)
         })
         it('does not affect the second', ()=>{
            expect(gm2.getValAtPosition(0, 0)).toEqual(100)
         })
         it('has different arrays for rowlist', () => {
            expect(gm1.rowList).not.toEqual(gm2.rowList)
         })
      })
   })

   describe('when created with a valid template', () => {
      const validTemplate = [
         [{val: 100},{val: 200}],
         [{val: 300},{val: 400}]
      ]
      var gameMap
      beforeEach(()=> {
         gameMap = new GameMap(validTemplate)
      })
      it('creates a game map', () => {
         expect(typeof(gameMap)).toEqual('object')
      })
      it('has no changes', () => {
         expect(gameMap.popChanges()).toHaveLength(0)
      })
      describe('when getValAtPosition', () => {
         it('returns the 100 at 0,0', () =>{
            expect(gameMap.getValAtPosition(0, 0)).toEqual(100)
         })
         it('returns the 300 at 0,1', () =>{
            expect(gameMap.getValAtPosition(0, 1)).toEqual(300)
         })
         it('returns the 200 at 1,0', () =>{
            expect(gameMap.getValAtPosition(1, 0)).toEqual(200)
         })
         it('returns the 400 at 1,1', () =>{
            expect(gameMap.getValAtPosition(1, 1)).toEqual(400)
         })
      })
      describe('when setValAtPosition', ()=> {
         it('getValAtPosition returns the new value', ()=> {
            const expectedVal = 17
            gameMap.setValAtPosition(expectedVal, 0, 0)
            expect(gameMap.getValAtPosition(0, 0)).toEqual(expectedVal)
         })
      })
      describe('when moveFromTo inside the map', ()=>{
         const from = {x: 1, y: 0}
         const to = {x: 1, y: 1}
         var beforeAtFrom
         beforeEach(()=>{
            beforeAtFrom = gameMap.getValAtPosition(from.x, from.y)
            gameMap.moveFromTo(from, to)
         })
         it('has 200 a from before the move', () => {
            expect(beforeAtFrom).toEqual(200)
         })
         it('getValAtPosition returns EMPTY at the from position', () => {
            expect(gameMap.getValAtPosition(from.x, from.y)).toEqual(mazeVal.EMPTY)
         })
         it('getValAtPosition returns 200 for the to position', () => {
            expect(gameMap.getValAtPosition(to.x, to.y)).toEqual(200)
         })
         it('adds change at the from position', ()=> {
            expect(gameMap.popChanges()).toEqual(expect.arrayContaining([{x: from.x, y: from.y, val: 1, oldVal: 200}]))
         })
         it('adds change at the to position', ()=> {
            expect(gameMap.popChanges()).toEqual(expect.arrayContaining([{x: to.x, y: to.y, val: 200, oldVal: 400}]))
         })
         describe('when popChanges', ()=> {
            var actual
            beforeEach(()=>{
               actual = gameMap.popChanges()
            })
            it('returns a list with 2 changes', () => {
               expect(actual).toHaveLength(2)
            })
            it('returns empty changes on immediate calls to popChanges', () => {
               expect(gameMap.popChanges()).toHaveLength(0)
            })
         })
      })
   })
})
