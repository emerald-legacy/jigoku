import { CardTypes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

function penalty(target: DrawCard): number {
    return -3 * target.attachments.length;
}

export default class StrikeBeneathTheVeil extends DrawCard {
    static id = 'strike-beneath-the-veil';

    setupCardAbilities() {
        this.action({
            title: 'Give a military penalty to a participating character',

            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                    effect: AbilityDsl.effects.modifyBothSkills(penalty(context.target))
                }))
            },
            effect: 'give {0} {1}{2} and {1}{3}',
            effectArgs: (context) => [penalty(context.target as DrawCard), 'military','political']
        });
    }
}
