import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AsahinaStoryteller extends DrawCard {
    static id = 'asahina-storyteller';

    setupCardAbilities() {
        this.persistentEffect({
            match: card => card.getType() === CardTypes.Character && card.isHonored && card.isFaction('crane'),
            effect: AbilityDsl.effects.addKeyword('sincerity')
        });
    }
}


export default AsahinaStoryteller;

