import DrawCard from '../../DrawCard.js';
import { perConflict } from '../../AbilityLimit.js';
import { playerDelayedEffect } from '../../effects.js';
import { loseHonor, multiple, playerLastingEffect } from '../../GameActions/GameActions.js';
import { CardType, ConflictType } from '../../Constants.js';

class BreachOfEtiquette extends DrawCard {
    static id = 'breach-of-etiquette';

    setupCardAbilities() {
        this.conflictAction('Force honor loss on players when their non-courtier characters use abilities', { conflictType: ConflictType.Political })
            .gameAction(multiple([
                playerLastingEffect((context) => ({
                    targetController: context.player,
                    effect: playerDelayedEffect({
                        when: {
                            onCardAbilityTriggered: (event) =>
                                event.player === context.player && event.card.type === CardType.Character && !event.card.hasTrait('courtier')
                        },
                        message: '{1} loses 1 honor due to {0}',
                        messageArgs: (effectContext) => [context.player, effectContext.source],
                        multipleTrigger: true,
                        gameAction: loseHonor()
                    })
                })),
                playerLastingEffect((context) => ({
                    targetController: context.player.opponent,
                    effect: playerDelayedEffect({
                        when: {
                            onCardAbilityTriggered: (event) =>
                                event.player === context.player.opponent && event.card.type === CardType.Character && !event.card.hasTrait('courtier')
                        },
                        message: '{1} loses 1 honor due to {0}',
                        messageArgs: (effectContext) => [context.player.opponent, effectContext.source],
                        multipleTrigger: true,
                        gameAction: loseHonor()
                    })
                }))
            ]))
            .chatText('force honor loss on players when their non-courtier characters use abilities during this conflict')
            .max(perConflict(1));
    }
}


export default BreachOfEtiquette;
