import DrawCard from '../../drawcard.js';
import type BaseCard from '../../basecard.js';
import type Ring from '../../ring.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Castigated extends DrawCard {
    static id = 'castigated';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.delayedEffect({
                condition: (context: any) => context.source.parent && !context.source.parent.hasDash('political') && context.source.parent.getPoliticalSkill() < 1,
                message: '{0} is discarded by {1}',
                messageArgs: (context: any) => [context.source.parent, context.source],
                gameAction: AbilityDsl.actions.discardFromPlay()
            })
        });
    }

    canPlayOn(card: BaseCard | Ring) {
        return card instanceof DrawCard && card.isParticipating() && super.canPlayOn(card);
    }

    canPlay(context: any, playType: any) {
        if(!context.game.isDuringConflict('political') || !context.player.cardsInPlay.some((card: any) => card.getType() === CardTypes.Character && card.hasTrait('imperial'))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}


export default Castigated;
