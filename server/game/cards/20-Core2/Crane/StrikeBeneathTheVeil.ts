import { CardType } from '../../../Constants.js';
import { modifyBothSkills } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

function penalty(target: DrawCard): number {
    return -3 * target.attachments.length;
}

export default class StrikeBeneathTheVeil extends DrawCard {
    static id = 'strike-beneath-the-veil';

    setupCardAbilities() {
        this.action('Give a military penalty to a participating character')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, cardLastingEffect((context) => ({
                effect: modifyBothSkills(context.target ? penalty(context.target) : 0)
            })))
            .chatText('give {0} {1}{2} and {1}{3}', (context) => [penalty(context.target), 'military','political']);
    }
}
