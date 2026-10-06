import { CardType } from '../../../Constants.js';
import { modifyMilitarySkill, modifyPoliticalSkill } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';

function bonusBase(context: AbilityContext) {
    const elementalTraits = new Set();
    context.player.cardsInPlay.forEach((character) => {
        for(const trait of character.getTraits()) {
            switch(trait) {
                case 'air':
                case 'earth':
                case 'fire':
                case 'void':
                case 'water':
                    elementalTraits.add(trait);
            }
        }
    });
    return elementalTraits.size;
}

export default class AgashaJianyu extends DrawCard {
    static id = 'agasha-jianyu';

    public setupCardAbilities() {
        this.action('Empower a character with the combined strength of the elements')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect((context) => {
                const bonus = bonusBase(context);
                return {
                    effect: [
                        modifyMilitarySkill(2 * bonus),
                        modifyPoliticalSkill(1 * bonus)
                    ]
                };
            }))
            .effect('give {0} +{1}{2}/+{3}{4}', (context) => {
                const bonus = bonusBase(context);
                return [2 * bonus, 'military', 1 * bonus, 'political'];
            });
    }
}
