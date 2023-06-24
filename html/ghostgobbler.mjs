import { Player } from './player.mjs'
import { Game } from './game.mjs'
import { Screen } from './screen.mjs'

const player = new Player()
const screenElem = new Screen(document.getElementById('gameView'))
const game = new Game(screenElem, player)

