import { mazeKey } from "./gamemap.mjs";

export class Screen {
   /**
    * @param {*} div the element to add the grid of divs as children
    */
   constructor(div) {
      this.root = div
   }

   set classList(cssClassList) {
      this.root.classList = cssClassList
   }

   set htmlTemplate(htmlFragmentText) {
      this.root.replaceChildren();
      this.root.innerHTML = htmlFragmentText
   }

   updateScore(score) {
      var scoreSpan = document.getElementById('player-score')
      scoreSpan.innerHTML = formatScore(5, score)
   }

   /** Applies the given map classes to the screen grid
    *
    * @param {GameMap} gameMap
    */
   apply(gameMap) {
      this.root.replaceChildren();
      // the top bar for showing scores n stuff
      this.scoreBarDiv = document.createElement('div')
      this.scoreBarDiv.classList.add('topbar')
      this.scoreBarDiv.innerHTML = `
      <div class="score">
         <div>Score</div>
         <div id="player-score">0</div>
      </div>
      <div class="high-score">
         <div>High Score</div>
         <div id="high-score">0</div>
      </div>
      `
      this.root.appendChild(this.scoreBarDiv)

      // the game map container
      this.container = document.createElement('div')
      this.container.classList.add('screen')
      this.container.id = 'screen'
      this.root.appendChild(this.container)
      for (var i = 0; i < gameMap.rows.length; i++) {
         for (var j = 0; j < gameMap.rows[i].length; j++) {
            var cellDiv = document.createElement('div')
            cellDiv.classList.add("cell")
            cellDiv.classList.add(mazeKey[gameMap.rows[i][j].val])
            this.container.appendChild(cellDiv)
         }
      }
   }

   /** Updates the screen based on the list of changes
    *
    * @param {Array(Object)} changes  the list of changes (x, y, val)
    */
   update(gameMap) {
      const cells = this.container.children
      const changeList = gameMap.popChanges()
      changeList.forEach((change) => {
         cells[(change.y*gameMap.xSize)+change.x].classList = "cell"
         cells[(change.y*gameMap.xSize)+change.x].classList.add(gameMap.classesAtPosition(change.x, change.y))
         // cells[(change.y*this.xSize)+change.x].classList.add(mazeVal.PLAYER)
      })
   }
}

export function formatScore(digitCount, score) {
   return score.toString().padStart(digitCount, "0");
}