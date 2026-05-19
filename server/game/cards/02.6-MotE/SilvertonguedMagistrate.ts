import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class SilverTonguedMagistrate extends DrawCard {
    static id = 'silver-tongued-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            effect: AbilityDsl.effects.cannotContribute((conflict, context) => {
                return card => card.getFate() === 0 && card !== context.source;
            })
        });
    }
}


export default SilverTonguedMagistrate;
