import { modifyMilitarySkill } from '../../../effects.js';
import { cardLastingEffect, claimRing } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { CardType, ConflictType, Players } from '../../../Constants.js';
import { msg } from '../../../GameChat.js';

export default class StrikeAsTheElements extends DrawCard {
    static id = 'strike-as-the-elements';

    setupCardAbilities() {
        this.action('Increase a character\'s military skill')
            .target({
                name: 'character',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.isParticipating() && card.hasTrait('monk')
            }, cardLastingEffect({
                effect: modifyMilitarySkill(2)
            }))
            .ringTarget({
                name: 'ring',
                activePromptTitle: 'Choose an unclaimed ring',
                ringCondition: ring => ring.isUnclaimed()
            }, claimRing({ takeFate: true, type: ConflictType.Military }))
            .chatText((context) => msg`grant +2${'military'} to ${context.targets.character} and claim the ${context.rings.ring}`);
    }
}
