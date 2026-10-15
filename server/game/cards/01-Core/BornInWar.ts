import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { attachmentMilitarySkillModifier } from '../../effects.js';

class BornInWar extends DrawCard {
    static id = 'born-in-war';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: Trait.Cavalry
        });

        this.whileAttached({
            effect: attachmentMilitarySkillModifier((_card, context) => Object.values(context.game.rings).filter((ring) => ring.isUnclaimed()).length)
        });
    }
}


export default BornInWar;
