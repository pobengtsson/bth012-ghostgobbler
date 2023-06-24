import { Player } from "player";

describe('player', ()=> {
   describe('when created', () => {
      var player
      beforeEach(()=>{
         player = new Player()
      })
      it('has score 0', () => {
         expect(player.score).toEqual(0)
      })
      it('has highscore 0', () => {
         expect(player.highScore).toEqual(0)
      })
      it('has undefined position x', ()=> {
         expect(player.position.x).toBeUndefined()
      })
      it('has undefined position y', ()=> {
         expect(player.position.y).toBeUndefined()
      })
      describe('when setting position', ()=>{
         const expectedPosition = {x: 14, y: 17}
         beforeEach(()=>{
            player.position = expectedPosition
         })
         it('has position x set to 14', ()=> {
            expect(player.position.x).toEqual(expectedPosition.x)
         })
         it('has position y set to 17', ()=> {
            expect(player.position.y).toEqual(expectedPosition.y)
         })
      })
      describe('when addScore 5', ()=> {
         beforeEach(()=>{
            player.addScore(5)
         })
         it('adds 5 to score', () => {
            expect(player.score).toEqual(5)
         })
         describe('when adding 9 more', ()=> {
            it('player has 14 as score', ()=>{
               player.addScore(9)
               expect(player.score).toEqual(14)
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
         for (let ex of examples) {
            describe(`in direction ${ex.dir}`, ()=>{
               var actualPos
               beforeEach(()=>{
                  player.position = start
                  actualPos = player.nextCoordinates(ex.dir)
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
               expect( ()=> player.nextCoordinates('')).toThrow('Unknown direction')
            })
         })
      })

   })
})