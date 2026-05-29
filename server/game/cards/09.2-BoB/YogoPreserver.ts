import DrawCard from '../../DrawCard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class YogoPreserver extends DrawCard {
    static id = 'yogo-preserver';

    setupCardAbilities() {
        this.persistentEffect({
            match: card => card.getType() === CardTypes.Character && card.isDishonored,
            effect: AbilityDsl.effects.addKeyword('sincerity')
        });
    }
}


export default YogoPreserver;

