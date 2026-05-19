import BaseCardSelector from './BaseCardSelector.js';

class UnlimitedCardSelector extends BaseCardSelector {
    hasReachedLimit(): boolean {
        return false;
    }
}

export default UnlimitedCardSelector;
