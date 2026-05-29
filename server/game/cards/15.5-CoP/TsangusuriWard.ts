import DrawCard from '../../DrawCard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

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

    canPlay(context: any, playType: any) {
        if(!context.player.cardsInPlay.some((card: any) => card.getType() === CardTypes.Character && card.hasTrait('shugenja'))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}


export default TsangusuriWard;
