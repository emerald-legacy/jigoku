import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AsahinaStoryteller extends DrawCard {
    static id = 'asahina-storyteller';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card: DrawCard) => card.getType() === CardType.Character && card.isHonored && card.isFaction('crane'),
            effect: AbilityDsl.effects.addKeyword('sincerity')
        });
    }
}


export default AsahinaStoryteller;

