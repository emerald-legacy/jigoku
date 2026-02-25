const BaseCardSelector = require('./BaseCardSelector.js');

class RingSelector extends BaseCardSelector {
    constructor(properties) {
        super(properties);
        this.ringCondition = properties.ringCondition;
        this.gameAction = properties.gameAction;
    }

    hasEnoughTargets(context) {
        return Object.values(context.game.rings).some(ring => this.ringCondition(ring, context));
    }

    defaultActivePromptTitle() {
        return 'Choose a ring';
    }

}

module.exports = RingSelector;
