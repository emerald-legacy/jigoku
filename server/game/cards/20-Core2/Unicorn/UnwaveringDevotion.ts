import { cardCannot, modifyGlory } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class UnwaveringDevotion extends DrawCard {
    static id = 'unwavering-devotion';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => card === context?.source.parentCharacter,
            effect: modifyGlory(1)
        });

        this.persistentEffect({
            match: (card, context) => card === context?.source.parentCharacter,
            effect: cardCannot({
                cannot: 'target',
                restricts: 'opponentsCharacterAbilitiesWithLowerGlory'
            })
        });
    }
}
