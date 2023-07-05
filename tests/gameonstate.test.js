import {jest} from '@jest/globals';
import { GameOnState } from "states/gameonstate"
import { mazeVal, mazeKey } from '../html/gamemap.mjs';

describe('GameOnState', ()=> {
   describe('when created', ()=>{
      var gameonstate
      var mockPlayer
      var mockScreen
      beforeEach(()=>{
         mockPlayer = {
            position: {x: 8, y: 8},
            addScore: jest.fn(),
            score: 687
         }
         mockScreen = {
            apply: jest.fn(),
            update: jest.fn(),
            updateScore: jest.fn(),
         }
         gameonstate = new GameOnState({}, mockScreen, mockPlayer)
      })
      it('has remaining dot count', () => {
         expect(gameonstate.remainingDots).toEqual(43)
      })
      it('has remaining power dot count', () => {
         expect(gameonstate.remainingPowerDots).toEqual(2)
      })
      it('has gameOver set to false', () => {
         expect(gameonstate.gameOver).toEqual(false)
      })
      describe('when loadView', () =>{
         let mockMap
         beforeEach(()=> {
            gameonstate.loadView()
            gameonstate.gameMap = mockMap = {
               getValAtPosition: jest.fn(),
               isValidPlayerMove: jest.fn(),
               nextCoordinates: jest.fn(),
               moveFromTo: jest.fn(),
            }
         })
         describe('when player makes a valid move', () =>{
            let event
            beforeEach(()=>{
               mockMap.isValidPlayerMove.mockReturnValue(true)
               event = {
                  preventDefault: jest.fn(),
                  stopPropagation: jest.fn(),
               }
            })
            describe('when handle event', () => {
               const examples = [
                  {gameOver: false, eventKey: 'ArrowUp', start: {x: 5, y: 5}, expectTo: {x: 7, y: 2}},
                  {gameOver: false, eventKey: 'ArrowDown', start: {x: 6, y: 6}, expectTo: {x: 5, y: 3}},
                  {gameOver: false, eventKey: 'ArrowLeft', start: {x: 2, y: 3}, expectTo: {x: 2, y: 8}},
                  {gameOver: false, eventKey: 'ArrowRight', start: {x: 7, y: 3}, expectTo: {x: 4, y: 8}},
                  {gameOver: true, eventKey: 'ArrowUp', start: {x: 5, y: 5}, expectTo: {x: 5, y: 5}},
                  {gameOver: true, eventKey: 'ArrowDown', start: {x: 6, y: 6}, expectTo: {x: 6, y: 6}},
                  {gameOver: true, eventKey: 'ArrowLeft', start: {x: 2, y: 3}, expectTo: {x: 2, y: 3}},
                  {gameOver: true, eventKey: 'ArrowRight', start: {x: 7, y: 3}, expectTo: {x: 7, y: 3}},
               ]

               for (let ex of examples) {
                  describe(`${ex.eventKey} and gameOver is ${ex.gameOver}`, ()=> {
                     beforeEach(()=>{
                        mockMap.nextCoordinates.mockReturnValue({x: ex.expectTo.x, y: ex.expectTo.y}),
                        mockPlayer.position = {x: ex.start.x, y: ex.start.y}
                        event.key = ex.eventKey
                        gameonstate.gameOver = ex.gameOver
                        gameonstate.handleEvent(event)
                     })
                     it('calls preventDefault', () => {
                        expect(event.preventDefault).toHaveBeenCalled()
                     })
                     it('calls stop propagation', () => {
                        expect(event.stopPropagation).toHaveBeenCalled()
                     })
                     if (ex.gameOver) {
                        it('does not update the player position', ()=> {
                           expect(mockPlayer.position).toEqual(ex.expectTo)
                        })
                        it('does not update the view', () => {
                           expect(mockScreen.update).not.toHaveBeenCalled()
                        })
                        it('does not move the player on the map', () => {
                           expect(mockMap.moveFromTo).not.toHaveBeenCalled()
                        })
                     } else {
                        it('updates the player position', ()=> {
                           expect(mockPlayer.position).toEqual(ex.expectTo)
                        })
                        it('updates the view', () => {
                           expect(mockScreen.update).toHaveBeenCalled()
                        })
                        it('updates the view with the latest gamemap', () => {
                           expect(mockScreen.update.mock.calls[0][0]).toBe(mockMap)
                        })
                        it('moves the player on the map', () => {
                           expect(mockMap.moveFromTo).toHaveBeenCalled()
                        })
                        it('moves the player from 8,8', () => {
                           expect(mockMap.moveFromTo.mock.calls[0][0]).toEqual(ex.start)
                        })
                        it('moves the player to 77,13', () => {
                           expect(mockMap.moveFromTo.mock.calls[0][1]).toEqual(ex.expectTo)
                        })
                     }
                  })
               }
            })
            describe('when moving into', ()=> {
               const examples = [{val: mazeVal.DOT, score: 5}, {val: mazeVal.POWERDOT, score: 50}]
               var expectedDotCount
               var expectedPowerDotCount
               for (let ex of examples) {
                  beforeEach(()=>{
                     expectedDotCount = gameonstate.remainingDots - 1
                     expectedPowerDotCount = gameonstate.remainingPowerDots - 1
                     event.key = 'ArrowUp'
                     mockMap.nextCoordinates.mockReturnValue({x: 5, y: 5})
                  })
                  describe(`a ${mazeKey[ex.val]}`, ()=> {
                     beforeEach(() => {
                        mockMap.getValAtPosition.mockReturnValue(ex.val)
                        gameonstate.handleEvent(event)
                     })
                     it('increases the score', () => {
                        expect(mockPlayer.addScore).toHaveBeenCalled()
                     })
                     switch (ex.val) {
                        case mazeVal.DOT:
                           it('decreases the remaining dot count by one', ()=>{
                              expect(gameonstate.remainingDots).toEqual(expectedDotCount)
                           })
                           break
                        case mazeVal.POWERDOT:
                           it('decreases the remaining powerdot count by one', () => {
                              expect(gameonstate.remainingPowerDots).toEqual(expectedPowerDotCount)
                           })
                           break
                     }
                     it('increases the score with level.dotScore', () => {
                        expect(mockPlayer.addScore.mock.calls[0][0]).toEqual(ex.score)
                     })
                     it('updates the screen with the new score', () => {
                        expect(mockScreen.updateScore.mock.calls[0][0]).toEqual(687)
                     })
                     it('updates the player-score on the screen', () => {
                        expect(mockScreen.updateScore).toHaveBeenCalled()
                     })
                     it('does not set game over', () => {
                        expect(gameonstate.gameOver).toEqual(false)
                     })
                     describe('when all dots are consumed', () => {
                        beforeEach(()=> {
                           gameonstate.remainingDots = ex.val == mazeVal.DOT ? 1 : 0
                           gameonstate.remainingPowerDots = ex.val == mazeVal.POWERDOT ? 1 : 0
                           gameonstate.handleEvent(event)
                        })
                        it('sets gameOver', ()=>{
                           expect(gameonstate.gameOver).toEqual(true)
                        })
                        it('shows you won banner', () => {

                        })
                        describe('when player presses a key', () => {
                           it('sets the welcome state', () => {

                           })
                           it('sets the last score', () => {

                           })
                           describe('when score is higher than highscore', ()=>{
                              it('sets the score as highscore', () => {

                              })
                           })
                           describe('when score is same or lower than high score', () => {
                              it('has same high score as before', () => {

                              })
                           })
                        })
                     })
                  })
               }

            })
         })
         describe('when player makes tries to make invalid move', () => {
            beforeEach(()=>{
               mockMap.isValidPlayerMove.mockReturnValue(false)
            })
            describe('when handle event', () => {
               const examples = [
                  {eventKey: 'ArrowUp', start: {x: 5, y: 5}},
                  {eventKey: 'ArrowDown', start: {x: 6, y: 6}},
                  {eventKey: 'ArrowLeft', start: {x: 2, y: 3}},
                  {eventKey: 'ArrowRight', start: {x: 7, y: 3}},
               ]

               for (let ex of examples) {
                  describe(ex.eventKey, ()=> {
                     let event
                     beforeEach(()=>{
                        mockPlayer.position = {x: ex.start.x, y: ex.start.y}
                        event = {
                           preventDefault: jest.fn(),
                           stopPropagation: jest.fn(),
                           key: ex.eventKey
                        }
                        gameonstate.handleEvent(event)
                     })
                     it('calls preventDefault', () => {
                        expect(event.preventDefault).toHaveBeenCalled()
                     })
                     it('calls stop propagation', () => {
                        expect(event.stopPropagation).toHaveBeenCalled()
                     })
                     it('does not move the player', ()=> {
                        expect(mockPlayer.position).toEqual(ex.start)
                     })
                     it('does not update the view', () => {
                        expect(mockScreen.update).not.toHaveBeenCalled()
                     })
                     it('moves the player on the map', () => {
                        expect(mockMap.moveFromTo).not.toHaveBeenCalled()
                     })
                     it('does not add to the score', () => {
                        expect(mockPlayer.addScore).not.toHaveBeenCalled()
                     })
                  })
               }
            })
         })
      })
   })
})