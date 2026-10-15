import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { perConflict } from '../../AbilityLimit.js';
import { playerDelayedEffect } from '../../effects.js';
import { loseHonor } from '../../GameActions/GameActions.js';
import { CardType, ConflictType, Players, Trait } from '../../Constants.js';

class BreachOfEtiquette extends DrawCard {
    static id = 'breach-of-etiquette';

    setupCardAbilities() {
        this.conflictAction('Force honor loss on players when their non-courtier characters use abilities', { conflictType: ConflictType.Political })
            .playerLastingEffect((context) => ({
                target: Players.Self,
                effect: playerDelayedEffect({
                    when: {
                        onCardAbilityTriggered: (event) =>
                            event.player === context.player && event.card.type === CardType.Character && !event.card.hasTrait(Trait.Courtier)
                    },
                    message: (effectContext) => msg`${effectContext.source} loses 1 honor due to ${context.player}`,
                    multipleTrigger: true,
                    gameAction: loseHonor()
                })
            }))
            .playerLastingEffect((context) => ({
                target: context.player.opponent,
                effect: playerDelayedEffect({
                    when: {
                        onCardAbilityTriggered: (event) =>
                            event.player === context.player.opponent && event.card.type === CardType.Character && !event.card.hasTrait(Trait.Courtier)
                    },
                    message: (effectContext) => msg`${effectContext.source} loses 1 honor due to ${context.player.opponent}`,
                    multipleTrigger: true,
                    gameAction: loseHonor()
                })
            }))
            .chatText('force honor loss on players when their non-courtier characters use abilities during this conflict')
            .max(perConflict(1));
    }
}


export default BreachOfEtiquette;
