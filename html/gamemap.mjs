
// key to get the style class from the state data
export const mazeKey = {
  0: 'wall',
  1: 'empty',
  2: 'dot',
  3: 'powerdot',
  10: 'transporter',
  50: 'player',
  60: 'ghost'
}

// key to get from identifier to value
export const mazeVal = {
  WALL: 0,
  EMPTY: 1,
  DOT: 2,
  POWERDOT: 3,
  TRANSPORTER: 10,
  PLAYER: 50,
  GHOST: 60,
}

function isUndefined(val) { return !val }
function isEmptyOrSingleRow(template) { return template.length < 2 }
function allValidRows(template) {
  return template.some((row, _, arr) => row.length === 0 || row.length !== arr[0].length || row.some((c) => c.val == undefined));
}

export class GameMap {
  constructor(template) {
    if (isUndefined(template)) { throw new Error('Called GameMap constructor with undefined template') }
    if (isEmptyOrSingleRow(template)) { throw new Error('Called GameMap constructor with empty template or too few rows (less than 2') }
    if (allValidRows(template)) {
      throw new Error(`GameMap constructor called with invalid template: ${template}.`)
    }
    this.rowList = template.map((row) => row.map((c) => { return { val: c.val } }))
    this.changeList = []
  }
  get rows() {
    return this.rowList
  }

  get xSize() { return this.rowList[0].length }

  getValAtPosition(x, y) {
    return this.rowList[y][x].val
  }

  setValAtPosition(val, x, y,) {
    this.addChangeListEntry({ x: x, y: y }, val, this.rowList[y][x].val)
    this.rowList[y][x].val = val
  }

  classesAtPosition(x, y) {
    return mazeKey[this.rowList[y][x].val]
  }

  nextCoordinates(from, direction) {
    switch (direction) {
       case 'ArrowUp':
          return {x: from.x, y: from.y-1}
       case 'ArrowDown':
          return {x: from.x, y: from.y+1}
       case 'ArrowLeft':
          return {x: from.x-1, y: from.y}
       case 'ArrowRight':
          return {x: from.x+1, y: from.y}
       default:
          throw new Error('Unknown direction')
    }
  }

  isWall(position) {
    return this.getValAtPosition(position.x, position.y) === mazeVal.WALL
  }

  movesOutsideMap(from, direction) {
    switch (direction) {
      case 'ArrowUp':
        return from.y == 0
      case 'ArrowDown':
        return from.y == (this.rowList.length - 1)
      case 'ArrowLeft':
        return from.x == 0
      case 'ArrowRight':
        return from.x == (this.rowList[0].length - 1)
    }
  }
  movesIntoWall(from, direction) {
    return this.isWall(this.nextCoordinates(from, direction))
  }

  isValidPlayerMove(from, direction) {
    if ( this.movesOutsideMap(from, direction) ) { return false }
    if ( this.movesIntoWall(from, direction) ) { return false }
    return true
  }

  moveFromTo(from, to) {
    const fromVal = this.getValAtPosition(from.x, from.y)
    const targetVal = this.getValAtPosition(to.x, to.y)
    this.rowList[from.y][from.x].val = mazeVal.EMPTY
    this.rowList[to.y][to.x].val = fromVal
    this.addChangeListEntry(from, mazeVal.EMPTY, fromVal)
    this.addChangeListEntry(to, fromVal, targetVal)
  }

  /**
   * Adds a new entry to the change list.
   *
   * @param {Object} point - An object with `x` and `y` properties indicating the position.
   * @param {Any} value - The value to be set in the change list.
   */
  addChangeListEntry(point, value, oldVal) {
    this.changeList.push({
      x: point.x,
      y: point.y,
      val: value,
      oldVal: oldVal
    });
  }

  /**
   * returns a list of the changes to the map since last call and resets the change list
   */
  popChanges() {
    const changes = this.changeList
    this.changeList = []
    return changes
  }
}
