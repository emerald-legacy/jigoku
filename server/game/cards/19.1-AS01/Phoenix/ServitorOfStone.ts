import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { cardCannot, delayedEffect } from '../../../effects.js';
import { discardFromPlay } from '../../../GameActions/GameActions.js';
import { CardType, RestrictionType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ServitorOfStone extends DrawCard {
    static id = 'servitor-of-stone';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => this.controllerHasShugenjaAtSameLocation(context),
            effect: cardCannot({ cannot: RestrictionType.LeavePlay })
        });

        this.persistentEffect({
            effect: delayedEffect({
                condition: (context) => !this.controllerHasShugenjaAtSameLocation(context),
                message: (context) => msg`${context.source} is discarded from play because ${context.player} controls no Shugenja at their location`,
                gameAction: discardFromPlay()
            })
        });
    }

    private controllerHasShugenjaAtSameLocation(context: AbilityContext) {
        return context.player.anyCardsInPlay(
            (otherCard) =>
                otherCard.type === CardType.Character &&
                otherCard.hasTrait('shugenja') &&
                context.source.isInConflict() === otherCard.isInConflict()
        );
    }
}
