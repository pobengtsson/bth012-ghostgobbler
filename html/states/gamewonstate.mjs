export class GameWonState {
   constructor(game, lastScore) {
      this.game = game
      this.lastScore = lastScore
   }

   handleEvent(event) {
      this.game.returnToMenu(this.lastScore)
   }
}