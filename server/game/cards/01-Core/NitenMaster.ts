import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class NitenMaster extends DrawCard {
    static id = 'niten-master';

    setupCardAbilities() {
        this.reaction('Ready this character')
            .when({
                onCardAttached: (event, context) => (
                    event.parent === context.source &&
                    event.card.hasTrait('weapon') &&
                    event.card.controller === context.player
                )
            })
            .ready()
            .limit(AbilityDsl.limit.perRound(2));
    }
}


export default NitenMaster;
