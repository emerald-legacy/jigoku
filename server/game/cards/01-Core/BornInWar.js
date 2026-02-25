const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class BornInWar extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'cavalry'
        });

        this.whileAttached({
            effect: AbilityDsl.effects.attachmentMilitarySkillModifier((card, context) => Object.values(context.game.rings).filter(ring => ring.isUnclaimed()).length)
        });
    }
}

BornInWar.id = 'born-in-war';

module.exports = BornInWar;
