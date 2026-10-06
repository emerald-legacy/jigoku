import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { addKeyword } from '../../effects.js';

class AsahinaStoryteller extends DrawCard {
    static id = 'asahina-storyteller';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card) => card.getType() === CardType.Character && card.isHonored && card.isFaction('crane'),
            effect: addKeyword('sincerity')
        });
    }
}


export default AsahinaStoryteller;

