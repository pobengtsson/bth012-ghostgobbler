import { GameMap, mazeVal } from "../gamemap.mjs";
import { level1 } from "../level.mjs";

export class GameOnState {
   constructor(game, gameScreen, player) {
      this.game = game;
      this.gameScreen = gameScreen
      this.player = player
      this.level = level1
   }

   async loadView() {
      this.gameScreen.classList = ["gameon"]
      this.gameMap = new GameMap(this.level.mapTemplate)
      this.player.position = this.level.playerStartPosition
      this.gameMap.setValAtPosition(mazeVal.PLAYER, this.player.position.x, this.player.position.y)
      this.gameScreen.apply(this.gameMap)
   }

   handleEvent(event) {
      update_based_on_event: {
         switch (event.key) {
            case 'ArrowRight':
            case 'ArrowLeft':
            case 'ArrowDown':
            case 'ArrowUp':
               event.preventDefault()
               event.stopPropagation()
               if (this.gameMap.isValidPlayerMove(this.player.position, event.key)) {
                  const nextPosition = this.gameMap.nextCoordinates(this.player.position, event.key)
                  const atTargetPosition = this.gameMap.getValAtPosition(nextPosition.x, nextPosition.y)
                  this.gameMap.moveFromTo(this.player.position, nextPosition)
                  this.player.position = nextPosition
                  switch (atTargetPosition) {
                     case mazeVal.DOT:
                        this.player.addScore(this.level.dotScore)
                        break
                     case mazeVal.POWER_DOT:
                        this.player.addScore(this.level.powerDotScore)
                        break
                  }
                  this.gameScreen.updateScore(this.player.score)
               } else {
                  break update_based_on_event
               }
                  // ok, passage to other side
                  // collides with ghost, move player, then game over
                  break
               case 'Escape':
               case 'Q':
               case 'q':
               case 'P':
               case 'p':
                  console.log(`Received event: ${event.key}`)
                  // this.gameData.setState(new PausedState(this.gameData))
               break
            default:
               console.log('Default')
               break
         }
         this.gameScreen.update(this.gameMap)
      }
   }
}

