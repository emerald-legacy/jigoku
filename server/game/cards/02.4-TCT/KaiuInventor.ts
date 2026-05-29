import DrawCard from '../../DrawCard.js';
import { Locations, Durations, Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class KaiuInventor extends DrawCard {
    static id = 'kaiu-inventor';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Add an additional ability use to a holding',
            target: {
                cardType: CardTypes.Holding,
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: card => card.isFaceup(),
                gameAction: ability.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfRound,
                    targetLocation: Locations.Provinces,
                    effect: ability.effects.increaseLimitOnAbilities()
                })
            },
            effect: 'add an additional use to each of {0}\'s abilities'
        });
    }
}


export default KaiuInventor;
