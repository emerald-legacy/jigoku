import { CardType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

function penalty(target: DrawCard): number {
    return -3 * target.attachments.length;
}

export default class StrikeBeneathTheVeil extends DrawCard {
    static id = 'strike-beneath-the-veil';

    setupCardAbilities() {
        this.action('Give a military penalty to a participating character')
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.cardLastingEffect((context) => ({
                effect: AbilityDsl.effects.modifyBothSkills(context.target ? penalty(context.target) : 0)
            })))
            .effect('give {0} {1}{2} and {1}{3}', (context) => [context.target ? penalty(context.target) : 0, 'military','political']);
    }
}
