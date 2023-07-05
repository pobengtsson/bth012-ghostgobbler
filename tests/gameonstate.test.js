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
                  {eventKey: 'ArrowUp', start: {x: 5, y: 5}, expectTo: {x: 7, y: 2}},
                  {eventKey: 'ArrowDown', start: {x: 6, y: 6}, expectTo: {x: 5, y: 3}},
                  {eventKey: 'ArrowLeft', start: {x: 2, y: 3}, expectTo: {x: 2, y: 8}},
                  {eventKey: 'ArrowRight', start: {x: 7, y: 3}, expectTo: {x: 4, y: 8}},
               ]

               for (let ex of examples) {
                  describe(ex.eventKey, ()=> {
                     beforeEach(()=>{
                        mockMap.nextCoordinates.mockReturnValue({x: ex.expectTo.x, y: ex.expectTo.y}),
                        mockPlayer.position = {x: ex.start.x, y: ex.start.y}
                        event.key = ex.eventKey
                        gameonstate.handleEvent(event)
                     })
                     it('calls preventDefault', () => {
                        expect(event.preventDefault).toHaveBeenCalled()
                     })
                     it('calls stop propagation', () => {
                        expect(event.stopPropagation).toHaveBeenCalled()
                     })
                     it('moves the player', ()=> {
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
                  })
               }
            })
            describe('when moving into', ()=> {
               const examples = [{val: mazeVal.DOT, score: 5}, {val: mazeVal.POWERDOT, score: 50}]
               for (var ex of examples) {
                  beforeEach(()=>{
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
                     it('increases the score with level.dotScore', () => {
                        expect(mockPlayer.addScore.mock.calls[0][0]).toEqual(ex.score)
                     })
                     it('updates the screen with the new score', () => {
                        expect(mockScreen.updateScore.mock.calls[0][0]).toEqual(687)
                     })
                     it('updates the player-score on the screen', () => {
                        expect(mockScreen.updateScore).toHaveBeenCalled()
                     })
                     describe('when all dots are consumed', () => {
                        it('disables the movement of the player avatar', ()=>{

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