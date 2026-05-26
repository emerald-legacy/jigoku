import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class BornInWar extends DrawCard {
    static id = 'born-in-war';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'cavalry'
        });

        this.whileAttached({
            effect: AbilityDsl.effects.attachmentMilitarySkillModifier((card: any, context: any) => Object.values(context.game.rings).filter((ring: any) => ring.isUnclaimed()).length)
        });
    }
}


export default BornInWar;
