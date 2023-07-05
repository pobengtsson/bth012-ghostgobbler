import { Player } from './player.mjs'
import { Game } from './game.mjs'
import { Screen } from './screen.mjs'

const player = new Player()
const gameScreen = new Screen(document.getElementById('gameView'))
let game = new Game(gameScreen, player)
game.setState(game.startState())

