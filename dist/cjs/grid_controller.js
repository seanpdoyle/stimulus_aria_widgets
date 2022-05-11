"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stimulus_1 = require("stimulus");
class default_1 extends stimulus_1.Controller {
    gridcellTargetConnected(target) {
        if (target.hasAttribute("tabindex"))
            return;
        const row = this.rowTargets.findIndex(row => row.contains(target));
        const column = this.gridcellTargets.indexOf(target);
        const tabindex = row == this.rowValue && column == this.columnValue ?
            0 :
            -1;
        target.setAttribute("tabindex", tabindex.toString());
    }
    captureFocus({ target }) {
        if (target instanceof HTMLElement) {
            const row = this.rowTargets.find(row => row.contains(target));
            if (row) {
                const columnsInRow = this.gridcellTargets.filter(column => row.contains(column));
                this.rowValue = this.rowTargets.indexOf(row);
                this.columnValue = columnsInRow.indexOf(target);
                for (const column of this.gridcellTargets) {
                    const tabindex = column == target ?
                        0 :
                        -1;
                    column.setAttribute("tabindex", tabindex.toString());
                }
            }
        }
    }
    moveColumn({ key, ctrlKey, params: { directions, boundaries } }) {
        if (directions && key in directions) {
            const row = this.rowTargets[this.rowValue];
            const columnsInRow = this.gridcellTargets.filter(column => row.contains(column));
            this.columnValue += directions[key];
            this.columnValue = Math.min(this.columnValue, columnsInRow.length - 1);
            this.columnValue = Math.max(0, this.columnValue);
            const nextColumn = columnsInRow[this.columnValue];
            if (nextColumn)
                nextColumn.focus();
        }
        else if (boundaries && key in boundaries) {
            if (boundaries[key] < 1) {
                const row = ctrlKey ?
                    this.rowTargets[0] :
                    this.rowTargets[this.rowValue];
                const columnsInRow = this.gridcellTargets.filter(column => row.contains(column));
                const [nextColumn] = columnsInRow;
                if (nextColumn)
                    nextColumn.focus();
            }
            else {
                const row = ctrlKey ?
                    this.rowTargets[this.rowTargets.length - 1] :
                    this.rowTargets[this.rowValue];
                const columnsInRow = this.gridcellTargets.filter(column => row.contains(column));
                const nextColumn = columnsInRow[columnsInRow.length - 1];
                if (nextColumn)
                    nextColumn.focus();
            }
        }
    }
    moveRow({ key, params: { directions } }) {
        if (directions && key in directions) {
            this.rowValue += directions[key];
            this.rowValue = Math.min(this.rowValue, this.rowTargets.length - 1);
            this.rowValue = Math.max(0, this.rowValue);
            const row = this.rowTargets[this.rowValue];
            const columnsInRow = this.gridcellTargets.filter(column => row.contains(column));
            const nextColumn = columnsInRow[this.columnValue];
            if (nextColumn)
                nextColumn.focus();
        }
    }
}
exports.default = default_1;
default_1.targets = ["gridcell", "row"];
default_1.values = { column: Number, row: Number };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZF9jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2dyaWRfY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFxQztBQVNyQyxlQUFxQixTQUFRLHFCQUFVO0lBVXJDLHVCQUF1QixDQUFDLE1BQW1CO1FBQ3pDLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7WUFBRSxPQUFNO1FBRTNDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO1FBQ2xFLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ25ELE1BQU0sUUFBUSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbEUsQ0FBQyxDQUFDLENBQUM7WUFDSixDQUFDLENBQUMsQ0FBQTtRQUVKLE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0lBQ3RELENBQUM7SUFFRCxZQUFZLENBQUMsRUFBRSxNQUFNLEVBQWM7UUFDakMsSUFBSSxNQUFNLFlBQVksV0FBVyxFQUFFO1lBQ2pDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO1lBRTdELElBQUksR0FBRyxFQUFFO2dCQUNQLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxN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