import { jest } from '@jest/globals'
import { GameWonState } from '../html/states/gamewonstate.mjs'

describe('GameWonState', ()=>{
   describe('when created', () => {
      var mockGame
      var gameWonState
      var expectedLastScore
      beforeEach(()=>{
         mockGame = {
            returnToMenu: jest.fn()
         }
         expectedLastScore = 7324
         gameWonState = new GameWonState(mockGame, expectedLastScore)
      })
      it('has the provided lastScore', ()=>{
         expect(gameWonState.lastScore).toEqual(expectedLastScore)
      })
      it('has the provided game', () => {
         expect(gameWonState.game).toBe(mockGame)
      })
      describe('when handleevent', () => {
         beforeEach(()=> {
            gameWonState.handleEvent(' ')
         })
         it('returns to menu', ()=> {
            expect(mockGame.returnToMenu).toHaveBeenCalled()
         })
         it('passes along the lastScore', () => {
            expect(mockGame.returnToMenu.mock.calls[0][0]).toEqual(expectedLastScore)
         })
      })
   })
})