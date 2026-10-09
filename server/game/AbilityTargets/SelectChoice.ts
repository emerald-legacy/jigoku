import { TargetMode } from '../Constants.js';

/** A chosen select label; `L` is the select's labels where the builder knows them. */
export class SelectChoice<L extends string = string> {
    constructor(public choice: L) {}

    getShortSummary() {
        return {
            id: this.choice,
            label: this.choice,
            name: this.choice,
            type: TargetMode.Select
        };
    }
}
