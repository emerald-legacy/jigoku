import DrawCard from '../../DrawCard.js';
import { returnToDeck } from '../../GameActions/GameActions.js';

class MiwakuKabe extends DrawCard {
    static id = 'miwaku-kabe';

    setupCardAbilities() {
        this.interrupt('Shuffle this into deck')
            .when({
                onBreakProvince: (event, context) => event.card.controller === context.player && event.card.location === context.source.location
            })
            .gameAction(returnToDeck({ shuffle: true }))
            .chatText('shuffle itself back into the dynasty deck');
    }
}


export default MiwakuKabe;
