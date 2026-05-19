import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class CloudTheMind extends DrawCard {
    static id = 'cloud-the-mind';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.blank()
        });
    }

    canPlay(context, playType) {
        if(!context.player.cardsInPlay.some(card => card.getType() === CardTypes.Character && card.hasTrait('shugenja'))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}


export default CloudTheMind;


