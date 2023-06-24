import { GameOnState } from './states/gameonstate.mjs';
import { WelcomeState } from './states/welcomestate.mjs';

export class Game {
   constructor(screenElem, player) {
      this.player = player
      this.screenElem = screenElem
      const startState = new WelcomeState(this, screenElem)
      this.setState(startState)
   }

   async setState(state) {
      console.log(`Setting game state to: ${state.constructor.name}`)
      this.state = state
      if (this.handleEvent) {
         window.removeEventListener('keydown', this.handleEvent)
      }
      this.handleEvent = this.state.handleEvent.bind(this)
      window.addEventListener('keydown', this.handleEvent)
      try {
         await this.state.loadView()
      } catch (error) {
         console.log(error)
      }
   }

   startGame() {
      // set up game or any other setup you want to do
      console.log('Game Started')
      this.setState(new GameOnState(this, this.screenElem, this.player))
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

   wonGame() {
      // game won scenario
      console.log('Game Won')
      this.setState(new GameWonState(this))
   }
}
