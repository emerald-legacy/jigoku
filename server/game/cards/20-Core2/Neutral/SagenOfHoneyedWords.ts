import { CardType, Players } from '../../../Constants.js';
import { modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

function skillBonus(companion: DrawCard): number {
    return companion.getGlory();
}

export default class SagenOfHoneyedWords extends DrawCard {
    static id = 'sagen-of-honeyed-words';

    public setupCardAbilities() {
        this.action('Gain a skill bonus based on your company')
            .condition((context) => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source
            })
            .gameAction(cardLastingEffect((context) => ({
                effect: modifyBothSkills(skillBonus(context.target))
            })))
            .effect('get +{1}{2} and +{3}{4}', (context) => {
                const bonus = skillBonus(context.target);
                return [bonus, 'military', bonus, 'political'];
            });
    }
}
