import { GameOnState } from './states/gameonstate.mjs';
import { WelcomeState } from './states/welcomestate.mjs';
import { GameWonState } from './states/gamewonstate.mjs';

export class Game {
   constructor(gameScreen, player) {
      this.player = player
      this.gameScreen = gameScreen
   }

   startState() {
      return new WelcomeState(this, this.gameScreen)
   }

   async setState(state) {
      this.state = state
      if (this.handleEvent) {
         window.removeEventListener('keydown', this.handleEvent)
      }
      this.handleEvent = this.state.handleEvent.bind(this.state)
      window.addEventListener('keydown', this.handleEvent)
      try {
         await this.state.loadView()
      } catch (error) {
         console.log(error)
      }
   }

   startGame() {
      this.setState(new GameOnState(this, this.gameScreen, this.player))
   }

   pauseGame() {
      // pause game
      console.log('Game Paused')
      this.setState(new PausedState(this))
   }

   lostGame() {
      // game lost scenario
      console.log('Game Lost')
      this.setState(new GameLostState(this))
   }

   gameWon(lastScore) {
      this.setState(new GameWonState(this, lastScore))
   }
}
