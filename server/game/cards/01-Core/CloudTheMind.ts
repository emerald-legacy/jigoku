import DrawCard from '../../drawcard';
import { CardTypes } from '../../Constants';
import AbilityDsl from '../../abilitydsl';

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


