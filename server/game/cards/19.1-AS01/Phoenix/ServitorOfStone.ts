import type { AbilityContext } from '../../../AbilityContext.js';
import { cardCannot, delayedEffect } from '../../../effects.js';
import { discardFromPlay } from '../../../GameActions/GameActions.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ServitorOfStone extends DrawCard {
    static id = 'servitor-of-stone';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => this.controllerHasShugenjaAtSameLocation(context),
            effect: cardCannot({ cannot: 'leavePlay' })
        });

        this.persistentEffect({
            effect: delayedEffect({
                condition: (context) => !this.controllerHasShugenjaAtSameLocation(context),
                message: '{0} is discarded from play because {1} controls no Shugenja at their location',
                messageArgs: (context) => [context.source, context.player],
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
