import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Duration } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ShinjoArcher extends DrawCard {
    static id = 'shinjo-archer';

    public setupCardAbilities() {
        this.action('Move and give -2/-2')
            .cost(AbilityDsl.costs.switchLocation())
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.modifyBothSkills(-2),
                duration: Duration.UntilEndOfConflict
            }))
            .effect('give {0} -2{2}/-2{3}', (context) => [context.source, 'military', 'political']);
    }
}
