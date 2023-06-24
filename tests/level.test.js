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
})

