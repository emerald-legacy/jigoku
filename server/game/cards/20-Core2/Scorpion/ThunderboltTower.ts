import { CardType, Duration } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class ThunderboltTower extends StrongholdCard {
    static id = 'thunderbolt-tower';

    setupCardAbilities() {
        this.action({
            title: 'Give a character -2/-2',
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                cardType: CardType.Character,
                cardCondition: (card) => !card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Duration.UntilEndOfPhase,
                    effect: AbilityDsl.effects.modifyBothSkills(-2)
                })
            },
            effect: 'give {0} -2{1}/-2{2} for the phase',
            effectArgs: () => ['military', 'political']
        });
    }
}
