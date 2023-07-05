import { GameMap, mazeVal } from 'gamemap'
import { Game } from '../html/game.mjs'

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
      describe('nextCoordinates', ()=> {
         const start = {x: 100, y: 100}
         const examples = [
            {dir: 'ArrowUp', x: start.x, y: start.y-1},
            {dir: 'ArrowDown', x: start.x, y: start.y+1},
            {dir: 'ArrowLeft', x: start.x-1, y: start.y},
            {dir: 'ArrowRight', x: start.x+1, y: start.y},
         ]
         for (let ex of examples) {
            describe(`in direction ${ex.dir}`, ()=>{
               var actualPos
               beforeEach(() => {
                  actualPos = gameMap.nextCoordinates({x: start.x, y: start.y}, ex.dir)
               })
               it(`sets x to ${ex.x}`, ()=>{
                  expect(actualPos.x).toEqual(ex.x)
               })
               it(`sets y to ${ex.y}`, ()=>{
                  expect(actualPos.y).toEqual(ex.y)
               })
            })
         }
         describe('other directions', ()=> {
            it('throws exception', ()=>{
               expect( ()=> gameMap.nextCoordinates('')).toThrow('Unknown direction')
            })
         })
      })
   })
   describe('when isValidPlayerMove', ()=>{
      describe('target position is maze wall', () => {
         const template = [
            [{ val: mazeVal.WALL },{ val: mazeVal.WALL }, { val: mazeVal.WALL },{ val: mazeVal.WALL }],
            [{ val: mazeVal.WALL },{ val: mazeVal.WALL }, { val: mazeVal.WALL },{ val: mazeVal.WALL }],
            [{ val: mazeVal.WALL },{ val: mazeVal.WALL }, { val: mazeVal.WALL },{ val: mazeVal.WALL }],
            [{ val: mazeVal.WALL },{ val: mazeVal.WALL }, { val: mazeVal.WALL },{ val: mazeVal.WALL }],
         ]
         const directions = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
         const gameMap = new GameMap(template)
         for (let dir of directions) {
            describe(`moving in ${dir}`, () => {
               for (let y=1;y<3;y++) {
                  for (let x=1;x<3;x++) {
                     describe(`from position ${x} ${y}`, ()=> {
                        it('is valid to move to maze wall', ()=> {
                           expect(gameMap.isValidPlayerMove({x: x, y: y}, dir)).toEqual(false)
                        })
                     })
                  }
               }
            })
         }
      })
      describe("when target position is out of the map's bounds", ()=> {
         const template = [[{ val: mazeVal.EMPTY },{ val: mazeVal.EMPTY }],[{ val: mazeVal.EMPTY },{ val: mazeVal.EMPTY }]]
         const arrowUpExpected = [
            [false, false],
            [true, true]
         ]
         const arrowDownExpected = [
            [true, true],
            [false, false]
         ]
         const arrowLeftExpected = [
            [false, true],
            [false, true]
         ]
         const arrrowRightExpected = [
            [true, false],
            [true, false]
         ]

         const examples = [
            {positions: arrowUpExpected, direction: 'ArrowUp'},
            {positions: arrowDownExpected, direction: 'ArrowDown'},
            {positions: arrowLeftExpected, direction: 'ArrowLeft'},
            {positions: arrrowRightExpected, direction: 'ArrowRight'},
         ]
         for (let ex of examples) {
            describe(`for moving in ${ex.direction}`, () => {
               for (let y of ex.positions.map((_, idx)=> idx)) {
                  for (let x of ex.positions[y].map((_,idx)=>idx)) {
                     describe(`from position ${x},${y}`, () => {
                        it(`is ${ex.expected?'valid':'invalid'}`, () => {
                           expect(new GameMap(template).isValidPlayerMove({x: x, y: y}, ex.direction)).toEqual(ex.positions[y][x])
                        })
                     })
                  }
               }
            })
         }
      })
   })
})