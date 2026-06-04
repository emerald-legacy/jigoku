import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class BornInWar extends DrawCard {
    static id = 'born-in-war';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'cavalry'
        });

        this.whileAttached({
            effect: AbilityDsl.effects.attachmentMilitarySkillModifier((card, context) => Object.values(context.game.rings).filter(ring => ring.isUnclaimed()).length)
        });
    }
}


export default BornInWar;
