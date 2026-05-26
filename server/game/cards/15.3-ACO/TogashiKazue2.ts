import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, AbilityTypes } from '../../Constants.js';

class TogashiKazue2 extends DrawCard {
    static id = 'togashi-kazue-2';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card: any, context: any) => card.controller === context.player && card.type === CardTypes.Character,
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Persistent, {
                createCopies: true,
                condition: (context: any) => context.source.isDire(),
                effect: AbilityDsl.effects.increaseLimitOnAbilities()
            })
        });
    }
}


export default TogashiKazue2;
