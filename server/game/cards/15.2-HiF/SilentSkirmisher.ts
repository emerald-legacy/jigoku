import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Duration } from '../../Constants.js';

class SilentSkirmisher extends DrawCard {
    static id = 'silent-skirmisher';

    setupCardAbilities() {
        this.action('Sacrifice another for +2 military')
            .cost(AbilityDsl.costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card, context) => card !== context.source
            }))
            .condition(context => context.game.isDuringConflict())
            .gameAction(AbilityDsl.actions.cardLastingEffect(context => ({
                duration: Duration.UntilEndOfConflict,
                target: context.source,
                effect: AbilityDsl.effects.modifyMilitarySkill(2)
            })))
            .effect('give itself +2{1}', () => ['military']);
    }
}


export default SilentSkirmisher;

