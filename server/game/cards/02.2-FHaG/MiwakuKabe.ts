import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';

class MiwakuKabe extends DrawCard {
    static id = 'miwaku-kabe';

    override setupCardAbilities() {
        this.interrupt('Shuffle this into deck')
            .when({
                onBreakProvince: (event, context) => event.card.controller === context.player && event.card.location === context.source.location
            })
            .returnToDeck({ shuffle: true, location: Location.Provinces })
            .chatText('shuffle itself back into the dynasty deck');
    }
}


export default MiwakuKabe;
