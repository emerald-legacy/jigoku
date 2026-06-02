import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, AbilityType } from '../../Constants.js';

class TogashiKazue2 extends DrawCard {
    static id = 'togashi-kazue-2';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card: any, context: any) => card.controller === context.player && card.type === CardType.Character,
            effect: AbilityDsl.effects.gainAbility(AbilityType.Persistent, {
                createCopies: true,
                condition: (context: AbilityContext) => context.source.isDire(),
                effect: AbilityDsl.effects.increaseLimitOnAbilities()
            })
        });
    }
}


export default TogashiKazue2;
