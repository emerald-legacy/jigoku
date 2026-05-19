import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, AbilityTypes } from '../../Constants.js';

class TogashiKazue2 extends DrawCard {
    static id = 'togashi-kazue-2';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => card.controller === context.player && card.type === CardTypes.Character,
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Persistent, {
                createCopies: true,
                condition: context => context.source.isDire(),
                effect: AbilityDsl.effects.increaseLimitOnAbilities()
            })
        });
    }
}


export default TogashiKazue2;
