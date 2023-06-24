import { mazeKey } from "./maze.mjs";

export class Screen {
   /**
    * @param {*} div the element to add the grid of divs as children
    */
   constructor(div) {
      this.container = div
   }

   set classList(cssClassList) {
      this.container.classList = cssClassList
   }

   set htmlTemplate(htmlFragmentText) {
      this.container.replaceChildren();
      this.container.innerHTML = htmlFragmentText
   }

   /** Applies the given map classes to the screen grid
    *
    * @param {Map} map
    */
   apply(map) {
      this.container.replaceChildren();
      for (var i = 0; i < map.rows.length; i++) {
         for (var j = 0; j < map.rows[i].length; j++) {
            var cellDiv = document.createElement('div')
            cellDiv.classList.add("cell")
            cellDiv.classList.add(mazeKey[map.rowList[i][j].val])
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
