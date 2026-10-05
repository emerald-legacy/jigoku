import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class TheStoneOfSorrows extends DrawCard {
    static id = 'the-stone-of-sorrows';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => !!context.source.parentCharacter && !context.source.parentCharacter.bowed,
            targetController: Players.Opponent,
            effect: AbilityDsl.effects.playerCannot('takeFateFromRings')
        });
    }
}


export default TheStoneOfSorrows;
