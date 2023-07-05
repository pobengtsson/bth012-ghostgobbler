import {jest} from '@jest/globals'
import { Screen } from "screen"
import { level1 } from "level"
import { mazeKey } from '../html/gamemap.mjs'

describe('Screen', () => {
   let mockDiv
   beforeEach(()=>{
      mockDiv = {
         replaceChildren: jest.fn(),
         appendChild: jest.fn(),
      }
   })
   describe('when created', () => {
      var screen
      beforeEach(()=>{
         screen = new Screen(mockDiv)
      })
      it('has a root div', ()=> {
         expect(screen.root).toBe(mockDiv)
      })
      describe('when a map apply', () => {
         var mockMap
         var mockTopDiv
         var mockMapContainerDiv
         var cellDiv
         beforeEach(()=>{
            mockMap = {}
            mockMap.rows = level1.mapTemplate.map((row) => row.map((c) => { return { val: c.val } }))
            mockTopDiv = {
               classList: { add: jest.fn()},
               appendChild: jest.fn(),
            }
            cellDiv = {
               classList: { add: jest.fn()},
            }
            mockMapContainerDiv = {
               classList: { add: jest.fn()},
               appendChild: jest.fn(),
            }
            global.document = {
               createElement: jest.fn()
                  .mockReturnValueOnce(mockTopDiv)
                  .mockReturnValueOnce(mockMapContainerDiv)
                  .mockReturnValue(cellDiv)
            }
            screen.apply(mockMap)
         })
         it('replaces all children in the container element', () => {
            expect(mockDiv.replaceChildren).toHaveBeenCalled()
         })
         it('adds a div for top bar', ()=>{
            expect(mockDiv.appendChild.mock.calls[0][0]).toBe(mockTopDiv)
         })
         describe('the added top bar div', ()=> {
            it('sets the class topbar',()=>{
               expect(mockTopDiv.classList.add.mock.calls[0][0]).toEqual('topbar')
            })
            // more needed for showing the score...
         })
         it('adds a div for the game map', ()=>{
            expect(mockDiv.appendChild.mock.calls[1][0]).toBe(mockMapContainerDiv)
         })
         it('adds a screen style class to the div', () => {
            expect(mockMapContainerDiv.classList.add.mock.calls[0][0]).toEqual('screen')
         })
         describe('in the game map div', () => {
            it('has added a child div for each cell in the map', () => {
               expect(mockMapContainerDiv.appendChild.mock.calls).toHaveLength(100)
            })
            it('has given all child divs the "cell"-class', () => {
               const actual = mockMapContainerDiv.appendChild.mock.calls
                  .map((arg)=>arg[0].classList.add.mock.calls[0])
                  .filter((c) => c == "cell")
               expect(actual).toHaveLength(100)
            })
            it('adds styling class corresponding to map value', () => {
               const styleClasses = Object.values(mazeKey)
               const actual = mockMapContainerDiv.appendChild.mock.calls
                  .map((arg)=>arg[0].classList.add.mock.calls[1])
                  .filter((c)=> styleClasses.some((css)=> css == c))
               expect(actual).toHaveLength(100)
            })
         })
      })
      describe('when updateScore', () => {
         const examples = [
            {score: 39, expected: '00039'},
            {score: 7, expected: '00007'},
            {score: 500, expected: '00500'},
            {score: 80000, expected: '80000'},
         ]
         for (var ex of examples) {
            beforeEach(()=>{
               mockDiv = { innerHTML: '' }
               global.document= {
                  getElementById: jest.fn().mockReturnValue(mockDiv)
               }
               screen.updateScore(ex.score)
            })
            it.only(`sets the score value ${ex.score}`, () => {
               expect(mockDiv.innerHTML).toEqual(ex.expected)
            })
            it('gets the player score element', ()=>{
               expect(global.document.getElementById.mock.calls[0][0]).toEqual('player-score')
            })
         }
      })
   })
})
