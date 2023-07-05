import { level1 } from "level"

describe('level1', ()=> {
   describe('gamemap template', () => {
      it('has 10 rows', ()=>{
         expect(level1.mapTemplate[0]).toHaveLength(10)
      })
      it('has 10 columns', ()=> {
         expect(level1.mapTemplate).toHaveLength(10)
      })
   }),
   describe('playerStartPositiom', ()=> {
      it('is pos x = 8', () => {
         expect(level1.playerStartPosition.x).toEqual(8)
      })
      it('is pos y = 8', () => {
         expect(level1.playerStartPosition.y).toEqual(8)
      })
   })
   it('has dotscore', ()=>{
      expect(level1.dotScore).toEqual(5)
   })
   it('has powerdotscore', ()=>{
      expect(level1.powerDotScore).toEqual(50)
   })
   it('has playerStartingPosition', ()=> {
      expect(level1.playerStartPosition).toEqual({x: 8, y: 8})
   })
})

