import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, CardType } from '../../Constants.js';

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
                location: Location.Provinces,
                cardType: [CardType.Character, CardType.Holding, CardType.Event],
                gameAction: AbilityDsl.actions.moveCard({ destination: Location.DynastyDiscardPile })
            }
        });
    }
}


export default KyofukisHammer;

