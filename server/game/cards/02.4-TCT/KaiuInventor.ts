import DrawCard from '../../DrawCard.js';
import { Location, Duration, Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class KaiuInventor extends DrawCard {
    static id = 'kaiu-inventor';

    setupCardAbilities() {
        this.action('Add an additional ability use to a holding')
            .target('target', {
                cardType: CardType.Holding,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: card => card.isFaceup()
            }, AbilityDsl.actions.cardLastingEffect({
                duration: Duration.UntilEndOfRound,
                targetLocation: Location.Provinces,
                effect: AbilityDsl.effects.increaseLimitOnAbilities()
            }))
            .effect('add an additional use to each of {0}\'s abilities');
    }
}


export default KaiuInventor;
