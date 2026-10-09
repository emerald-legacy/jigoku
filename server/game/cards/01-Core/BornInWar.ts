import DrawCard from '../../DrawCard.js';
import { attachmentMilitarySkillModifier } from '../../effects.js';

class BornInWar extends DrawCard {
    static id = 'born-in-war';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'cavalry'
        });

        this.whileAttached({
            effect: attachmentMilitarySkillModifier((_card, context) => Object.values(context.game.rings).filter((ring) => ring.isUnclaimed()).length)
        });
    }
}


export default BornInWar;
