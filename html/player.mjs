export class Player {
   constructor(){
      this.score = 0
      this.highScore = 0
   }
   get position() {
      return {x: this.xPosition, y: this.yPosition}
   }
   set position(coord) {
      this.xPosition = coord.x
      this.yPosition = coord.y
   }

   addScore(value) {
      this.score += value
   }


}