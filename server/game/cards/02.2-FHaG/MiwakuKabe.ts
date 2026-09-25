import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class MiwakuKabe extends DrawCard {
    static id = 'miwaku-kabe';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.interrupt('Shuffle this into deck')
            .when({
                onBreakProvince: (event, context) => event.card.controller === context.player && event.card.location === context.source.location
            })
            .gameAction(ability.actions.returnToDeck({ shuffle: true }))
            .effect('shuffle itself back into the dynasty deck');
    }
}


export default MiwakuKabe;
