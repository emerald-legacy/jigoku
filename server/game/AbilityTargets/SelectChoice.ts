import { TargetMode } from '../Constants.js';

/** A chosen select label; `Label` is the select's labels where the builder knows them. */
export class SelectChoice<Label extends string = string> {
    constructor(public choice: Label) {}

    getShortSummary() {
        return {
            id: this.choice,
            label: this.choice,
            name: this.choice,
            type: TargetMode.Select
        };
    }
}
