import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class HaughtyMagistrate extends DrawCard {
    static id = 'haughty-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            effect: AbilityDsl.effects.cannotContribute((conflict: any, context: any) => {
                return (card: DrawCard) => card.getGlory() < context.source.getGlory() && card !== context.source;
            })
        });
    }
}


export default HaughtyMagistrate;
