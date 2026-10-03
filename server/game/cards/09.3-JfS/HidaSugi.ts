import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location } from '../../Constants.js';

class HidaSugi extends DrawCard {
    static id = 'hida-sugi';

    setupCardAbilities() {
        this.reaction('Move a discarded dynasty card')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isParticipating()
            })
            .target('target', {
                location: Location.DynastyDiscardPile
            }, AbilityDsl.actions.moveCard({ destination: Location.DynastyDeck, bottom: true}))
            .effect('move {0} to bottom of {1}\'s dynasty deck', context => [context.target?.controller ?? '']);
    }
}


export default HidaSugi;

