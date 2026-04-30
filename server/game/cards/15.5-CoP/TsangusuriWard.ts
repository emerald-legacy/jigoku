import DrawCard from '../../drawcard';
import { CardTypes } from '../../Constants';
import AbilityDsl from '../../abilitydsl';

class TsangusuriWard extends DrawCard {
    static id = 'tsangusuri-ward';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'play',
                restricts: 'opponentsAttachments',
                source: this
            })
        });
    }

    canPlay(context, playType) {
        if(!context.player.cardsInPlay.some(card => card.getType() === CardTypes.Character && card.hasTrait('shugenja'))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}


export default TsangusuriWard;
