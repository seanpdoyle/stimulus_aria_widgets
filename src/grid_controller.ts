import { Controller } from "stimulus"

type GridEventWithParams<T> = T & {
  params: {
    directions?: { [key: string]: number }
    boundaries?: { [key: string]: number }
  }
}

export default class extends Controller {
  static targets = [ "gridcell", "row" ]
  static values = { column: Number, row: Number }

  columnValue!: number
  rowValue!: number

  readonly rowTargets!: HTMLElement[]
  readonly gridcellTargets!: HTMLElement[]

  gridcellTargetConnected(target: HTMLElement) {
    if (target.hasAttribute("tabindex")) return

    const row = this.rowTargets.findIndex(row => row.contains(target))
    const column = this.gridcellTargets.indexOf(target)
    const tabindex = row == this.rowValue && column == this.columnValue ?
       0 :
      -1

    target.setAttribute("tabindex", tabindex.toString())
  }

  captureFocus({ target }: FocusEvent) {
    if (target instanceof HTMLElement) {
      const row = this.rowTargets.find(row => row.contains(target))

      if (row) {
        const columnsInRow = this.gridcellTargets.filter(column => row.contains(column))

        this.rowValue = this.rowTargets.indexOf(row)
        this.columnValue = columnsInRow.indexOf(target)

        for (const column of this.gridcellTargets) {
          const tabindex = column == target ?
            0 :
            -1

          column.setAttribute("tabindex", tabindex.toString())
        }
      }
    }
  }

  moveColumn({ key, ctrlKey, params: { directions, boundaries } }: GridEventWithParams<KeyboardEvent>) {
    if (directions && key in directions) {
      const row = this.rowTargets[this.rowValue]
      const columnsInRow = this.gridcellTargets.filter(column => row.contains(column))

      this.columnValue += directions[key]
      this.columnValue = Math.min(this.columnValue, columnsInRow.length - 1)
      this.columnValue = Math.max(0, this.columnValue)

      const nextColumn = columnsInRow[this.columnValue]

      if (nextColumn) nextColumn.focus()
    } else if (boundaries && key in boundaries) {
      if (boundaries[key] < 1) {
        const row = ctrlKey ?
          this.rowTargets[0] :
          this.rowTargets[this.rowValue]
        const columnsInRow = this.gridcellTargets.filter(column => row.contains(column))
        const [ nextColumn ] = columnsInRow

        if (nextColumn) nextColumn.focus()
      } else {
        const row = ctrlKey ?
          this.rowTargets[this.rowTargets.length - 1] :
          this.rowTargets[this.rowValue]
        const columnsInRow = this.gridcellTargets.filter(column => row.contains(column))
        const nextColumn = columnsInRow[columnsInRow.length - 1]

        if (nextColumn) nextColumn.focus()
      }
    }
  }

  moveRow({ key, params: { directions } }: GridEventWithParams<KeyboardEvent>) {
    if (directions && key in directions) {
      this.rowValue += directions[key]
      this.rowValue = Math.min(this.rowValue, this.rowTargets.length - 1)
      this.rowValue = Math.max(0, this.rowValue)

      const row = this.rowTargets[this.rowValue]
      const columnsInRow = this.gridcellTargets.filter(column => row.contains(column))
      const nextColumn = columnsInRow[this.columnValue]

      if (nextColumn) nextColumn.focus()
    }
  }
}
