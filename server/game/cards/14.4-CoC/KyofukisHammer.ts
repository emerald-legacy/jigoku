import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, CardType } from '../../Constants.js';

class KyofukisHammer extends DrawCard {
    static id = 'kyofuki-s-hammer';

    setupCardAbilities() {
        this.reaction('Discard a card from a province')
            .when({
                afterConflict: (event, context) => context.source.parentCharacter && context.source.parentCharacter.isParticipating() &&
                                                    event.conflict.winner === context.source.parentCharacter.controller
            })
            .target('target', {
                location: Location.Provinces,
                cardType: [CardType.Character, CardType.Holding, CardType.Event]
            }, AbilityDsl.actions.moveCard({ destination: Location.DynastyDiscardPile }))
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default KyofukisHammer;

