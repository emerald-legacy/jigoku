import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Duration, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ShinjoArcher extends DrawCard {
    static id = 'shinjo-archer';

    public setupCardAbilities() {
        this.action({
            title: 'Move and give -2/-2',

            cost: AbilityDsl.costs.switchLocation(),
            target: {
                mode: TargetMode.Single,
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.modifyBothSkills(-2),
                    duration: Duration.UntilEndOfConflict
                })
            },
            effect: 'give {0} -2{2}/-2{3}',
            effectArgs: (context) => [context.source, 'military', 'political']
        });
    }
}
