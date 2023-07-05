import { jest } from '@jest/globals'
import { Game } from "game"

describe('Game', ()=> {
   describe('when created', () => {
      var mockPlayer
      var mockGameScreen
      var game
      beforeEach(() => {
         mockPlayer = {}
         mockGameScreen = {}
         game = new Game(mockGameScreen, mockPlayer)
      })
      it('has the provided player', () => {
         expect(game.player).toBe(mockPlayer)
      })
      it('has the screen provided', () => {
         expect(game.gameScreen).toBe(mockGameScreen)
      })
      describe('when startState', ()=> {
         it('creates a welcome state', () => {
            var actual = game.startState()
            expect(actual.constructor.name).toEqual('WelcomeState')
         })
      })
      describe('when setState first time', () => {
         var mockState
         var mockBind
         beforeEach(()=> {
            mockBind = {}
            global.window = {
               removeEventListener: jest.fn(),
               addEventListener: jest.fn(),
            }
            mockState = {
               loadView: jest.fn(),
               handleEvent: { bind: jest.fn().mockReturnValue(mockBind) },
            }
            game.setState(mockState)
         })
         it('does not remove keydown listener', () => {
            expect(global.window.removeEventListener).not.toHaveBeenCalled()
         })
         it('then adds keydown listener', () => {
            expect(global.window.addEventListener).toHaveBeenCalled()
         })
         it('adds the new states handle event as listener', () => {
            expect(global.window.addEventListener.mock.calls[0][1]).toBe(mockBind)
         })
         it('adds keydown listener', () => {
            expect(global.window.addEventListener.mock.calls[0][0]).toEqual('keydown')
         })
         it('loads the state view', () => {
            expect(mockState.loadView).toHaveBeenCalled()
         })
         describe('when setting state the subsequent time', () => {
            beforeEach(()=> {
               game.setState(mockState)
            })
            it('removes the listener first', () => {
               expect(global.window.removeEventListener).toHaveBeenCalled()
            })
         })
      })
      describe('when startGame', () => {
         beforeEach(()=> {
            game.setState = jest.fn()
            game.startGame()
         })
         it('calls setState', () => {
            expect(game.setState).toHaveBeenCalled()
         })
         it('passes new gameonstate', () => {
            expect(game.setState.mock.calls[0][0].constructor.name).toEqual('GameOnState')
         })
         it('passes its gameScreen to GameOnState', () => {
            expect(game.setState.mock.calls[0][0].gameScreen).toBe(mockGameScreen)
         })
         it('passes itself to GameOnState', () => {
            expect(game.setState.mock.calls[0][0].game).toBe(game)
         })
      })
      describe('when gameWon', () => {
         var expectedScore
         beforeEach(()=> {
            expectedScore = 9837
            game.setState = jest.fn()
            game.gameWon(expectedScore)
         })
         it('calls setState', () => {
            expect(game.setState).toHaveBeenCalled()
         })
         it('passes new GameWonState', () => {
            expect(game.setState.mock.calls[0][0].constructor.name).toEqual('GameWonState')
         })
         it('passes the score', () => {
            expect(game.setState.mock.calls[0][0].lastScore).toBe(expectedScore)
         })
         it('passes itself to GameWonState', () => {
            expect(game.setState.mock.calls[0][0].game).toBe(game)
         })
      })
   })
})