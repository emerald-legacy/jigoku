import { BaseCardSelector } from './BaseCardSelector.js';

export class UnlimitedCardSelector extends BaseCardSelector {
    hasReachedLimit(): boolean {
        return false;
    }
}

