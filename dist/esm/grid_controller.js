import { Controller } from "stimulus";
export default class default_1 extends Controller {
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
default_1.targets = ["gridcell", "row"];
default_1.values = { column: Number, row: Number };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZF9jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2dyaWRfY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sVUFBVSxDQUFBO0FBU3JDLE1BQU0sQ0FBQyxPQUFPLGdCQUFPLFNBQVEsVUFBVTtJQVVyQyx1QkFBdUIsQ0FBQyxNQUFtQjtRQUN6QyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO1lBQUUsT0FBTTtRQUUzQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtRQUNsRSxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNuRCxNQUFNLFFBQVEsR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxNQUFNLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2xFLENBQUMsQ0FBQyxDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUE7UUFFSixNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtJQUN0RCxDQUFDO0lBRUQsWUFBWSxDQUFDLEVBQUUsTUFBTSxFQUFjO1FBQ2pDLElBQUksTUFBTSxZQUFZLFdBQVcsRUFBRTtZQUNqQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtZQUU3RCxJQUFJLEdBQUcsRUFBRTtnQkFDUCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxN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