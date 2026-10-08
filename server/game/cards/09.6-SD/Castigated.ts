import DrawCard from '../../DrawCard.js';
import type BaseCard from '../../BaseCard.js';
import type Ring from '../../Ring.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { CardType, ConflictType } from '../../Constants.js';
import { delayedEffect } from '../../effects.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';

class Castigated extends DrawCard {
    static id = 'castigated';

    setupCardAbilities() {
        this.whileAttached({
            effect: delayedEffect({
                condition: (context) => !!context.source.parentCharacter && !context.source.parentCharacter.hasDash('political') && context.source.parentCharacter.politicalSkill < 1,
                message: '{0} is discarded by {1}',
                messageArgs: (context) => [context.source.parentCharacter, context.source],
                gameAction: discardFromPlay()
            })
        });
    }

    canPlayOn(card: BaseCard | Ring) {
        return card instanceof DrawCard && card.isParticipating() && super.canPlayOn(card);
    }

    canPlay(context: AbilityContext, playType: string) {
        if(!context.game.isDuringConflict(ConflictType.Political) || !context.player.cardsInPlay.some((card) => card.getType() === CardType.Character && card.hasTrait('imperial'))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}


export default Castigated;
