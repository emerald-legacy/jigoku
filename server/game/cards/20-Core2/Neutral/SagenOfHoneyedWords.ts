import { msg } from '../../../GameChat.js';
import { CardType, Players } from '../../../Constants.js';
import { modifyBothSkills } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

function skillBonus(companion: DrawCard): number {
    return companion.glory;
}

export default class SagenOfHoneyedWords extends DrawCard {
    static id = 'sagen-of-honeyed-words';

    public setupCardAbilities() {
        this.conflictAction('Gain a skill bonus based on your company')
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source
            })
            .cardLastingEffect((context) => ({
                effect: modifyBothSkills(skillBonus(context.target))
            }))
            .chatText((context) => {
                const bonus = skillBonus(context.target);
                return msg`get +${bonus}${'military'} and +${bonus}${'political'}`;
            });
    }
}
