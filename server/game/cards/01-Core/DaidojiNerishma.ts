import DrawCard from '../../DrawCard.js';
import { Location, Players } from '../../Constants.js';
import { flipDynasty } from '../../GameActions/GameActions.js';

class DaidojiNerishma extends DrawCard {
    static id = 'daidoji-nerishma';

    setupCardAbilities() {
        this.action('Flip a card faceup')
            .target({
                controller: Players.Self,
                location: Location.Provinces,
                cardCondition: card => card.isDynasty && card.isFacedown()
            }, flipDynasty());
    }
}


export default DaidojiNerishma;
