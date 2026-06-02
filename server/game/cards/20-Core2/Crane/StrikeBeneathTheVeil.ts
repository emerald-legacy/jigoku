import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

function penalty(target: DrawCard): number {
    return -3 * target.attachments.length;
}

export default class StrikeBeneathTheVeil extends DrawCard {
    static id = 'strike-beneath-the-veil';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Give a military penalty to a participating character',

            target: {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect<DrawCard>((context) => ({
                    effect: AbilityDsl.effects.modifyBothSkills(context.target ? penalty(context.target) : 0)
                }))
            },
            effect: 'give {0} {1}{2} and {1}{3}',
            effectArgs: (context) => [context.target ? penalty(context.target) : 0, 'military','political']
        });
    }
}
