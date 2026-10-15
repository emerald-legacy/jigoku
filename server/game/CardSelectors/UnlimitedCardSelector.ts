import { BaseCardSelector } from './BaseCardSelector.js';

export class UnlimitedCardSelector extends BaseCardSelector {
    override hasReachedLimit(): boolean {
        return false;
    }
}

