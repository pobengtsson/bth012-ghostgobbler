import { GameMap, mazeVal } from "../maze.mjs";
import { level1 } from "../level.mjs";

export class GameOnState {
   constructor(game, screenElem, player) {
      this.game = game;
      this.screenElem = screenElem
      this.player = player
      this.level = level1
   }

   async loadView() {
      this.screenElem.classList = ["gameon"]
      this.map = new GameMap(this.level.mapTemplate)
      this.player.position = this.level.playerStartPosition
      this.map.setValAtPosition(mazeVal.PLAYER, this.player.position.x, this.player.position.y)
      this.screenElem.apply(this.map)
   }

   // remember that in the handleEvent this is bound to the Game instance.
   handleEvent(event) {
      console.log(`Received event: ${event.key}`)
      update_based_on_event: {
         switch (event.key) {
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
            case 'ArrowUp':
               event.stopPropagation()
               const currentPosition = this.player.position
               const nextCoord = this.player.nextCoordinates(event.key)
               const atTargetPosition = this.state.map.getValAtPosition(nextCoord.x, nextCoord.y)
               switch (atTargetPosition) {
                  case mazeVal.DOT:
                  case mazeVal.EMPTY:
                     this.state.map.moveFromTo(currentPosition, nextCoord)
                     this.player.position = nextCoord
                     break
                  case mazeVal.WALL:
                        break update_based_on_event
                  default:
                     console.log(`Uknown type ${atTargetPosition} at: ${nextCoord}`)
                     break
               }
               // ok, empty cell
               // ok, consume dot
               // ok, consumer power dot
               // ok, passage to other side
               // nok, wall, no update
               // collides with ghost, move player, then game over
               break
            case 'Escape':
            case 'Q':
            case 'q':
            case 'P':
            case 'p':
               // this.gameData.setState(new PausedState(this.gameData))
               break
            default:
               break
         }
         this.screenElem.update(this.state.map)
      }
   }
}
