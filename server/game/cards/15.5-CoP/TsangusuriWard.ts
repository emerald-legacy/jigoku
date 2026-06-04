import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { CardType } from '../../Constants.js';
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

    canPlay(context: AbilityContext, playType: string) {
        if(!context.player.cardsInPlay.some(card => card.getType() === CardType.Character && card.hasTrait('shugenja'))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}


export default TsangusuriWard;
