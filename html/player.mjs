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

   nextCoordinates(direction) {
      switch (direction) {
         case 'ArrowUp':
            return {x: this.xPosition, y: this.yPosition-1}
         case 'ArrowDown':
            return {x: this.xPosition, y: this.yPosition+1}
         case 'ArrowLeft':
            return {x: this.xPosition-1, y: this.yPosition}
         case 'ArrowRight':
            return {x: this.xPosition+1, y: this.yPosition}
         default:
            throw new Error('Unknown direction')
      }
   }
}