import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { addKeyword } from '../../effects.js';

class YogoPreserver extends DrawCard {
    static id = 'yogo-preserver';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card) => card.type === CardType.Character && card.isDishonored,
            effect: addKeyword('sincerity')
        });
    }
}


export default YogoPreserver;

