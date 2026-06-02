import DrawCard from '../../DrawCard.js';
import { Location, Duration, Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class KaiuInventor extends DrawCard {
    static id = 'kaiu-inventor';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Add an additional ability use to a holding',
            target: {
                cardType: CardType.Holding,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: card => card.isFaceup(),
                gameAction: ability.actions.cardLastingEffect({
                    duration: Duration.UntilEndOfRound,
                    targetLocation: Location.Provinces,
                    effect: ability.effects.increaseLimitOnAbilities()
                })
            },
            effect: 'add an additional use to each of {0}\'s abilities'
        });
    }
}


export default KaiuInventor;
