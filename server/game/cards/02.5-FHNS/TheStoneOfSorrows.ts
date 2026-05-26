import DrawCard from '../../drawcard.js';
import { Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class TheStoneOfSorrows extends DrawCard {
    static id = 'the-stone-of-sorrows';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            condition: context => !!context.source.parent && !context.source.parent.bowed,
            targetController: Players.Opponent,
            effect: ability.effects.playerCannot('takeFateFromRings')
        });
    }
}


export default TheStoneOfSorrows;
