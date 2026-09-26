import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { CardType, ConflictType, Players } from '../../../Constants.js';

export default class StrikeAsTheElements extends DrawCard {
    static id = 'strike-as-the-elements';

    setupCardAbilities() {
        this.action('Increase a character\'s military skill')
            .target('character', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.isParticipating() && card.hasTrait('monk')
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.modifyMilitarySkill(2)
            }))
            .ringTarget('ring', {
                activePromptTitle: 'Choose an unclaimed ring',
                ringCondition: ring => ring.isUnclaimed()
            }, AbilityDsl.actions.claimRing({ takeFate: true, type: ConflictType.Military }))
            .effect('grant +2{1} to {2} and claim the {3}', context => ['military', context.targets.character, context.rings.ring]);
    }
}
