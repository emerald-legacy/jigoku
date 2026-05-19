import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, CardTypes } from '../../Constants.js';

class KyofukisHammer extends DrawCard {
    static id = 'kyofuki-s-hammer';

    setupCardAbilities() {
        this.reaction({
            title: 'Discard a card from a province',
            when: {
                afterConflict: (event, context) => context.source.parent && context.source.parent.isParticipating() &&
                                                    event.conflict.winner === context.source.parent.controller
            },
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            target: {
                location: Locations.Provinces,
                cardType: [CardTypes.Character, CardTypes.Holding, CardTypes.Event],
                gameAction: AbilityDsl.actions.moveCard({ destination: Locations.DynastyDiscardPile })
            }
        });
    }
}


export default KyofukisHammer;

