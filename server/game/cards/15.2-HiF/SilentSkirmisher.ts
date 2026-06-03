import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Duration } from '../../Constants.js';

class SilentSkirmisher extends DrawCard {
    static id = 'silent-skirmisher';

    setupCardAbilities() {
        this.action({
            title: 'Sacrifice another for +2 military',
            condition: context => context.game.isDuringConflict(),
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardType.Character,
                cardCondition: (card, context) => card !== context.source
            }),
            effect: 'give itself +2{1}',
            effectArgs: () => ['military'],
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                duration: Duration.UntilEndOfConflict,
                target: context.source,
                effect: AbilityDsl.effects.modifyMilitarySkill(2)
            }))
        });
    }
}


export default SilentSkirmisher;

