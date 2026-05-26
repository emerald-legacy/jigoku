import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class StoicMagistrate extends DrawCard {
    static id = 'stoic-magistrate';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isDefending(),
            effect: AbilityDsl.effects.cannotContribute(() => {
                return (card: any) => card.costLessThan(3);
            })
        });
    }
}


export default StoicMagistrate;
