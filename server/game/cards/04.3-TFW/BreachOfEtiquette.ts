import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, EventName } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class BreachOfEtiquette extends DrawCard {
    static id = 'breach-of-etiquette';

    setupCardAbilities() {
        this.action('Force honor loss on players when their non-courtier characters use abilities')
            .condition(() => this.game.isDuringConflict('political'))
            .gameAction(AbilityDsl.actions.multiple([
                AbilityDsl.actions.playerLastingEffect((context) => ({
                    targetController: context.player,
                    effect: AbilityDsl.effects.playerDelayedEffect({
                        when: {
                            onCardAbilityTriggered: (event: EventPayload<EventName.OnCardAbilityTriggered>) =>
                                event.player === context.player && event.card.type === CardType.Character && !event.card.hasTrait('courtier')
                        },
                        message: '{1} loses 1 honor due to {0}',
                        messageArgs: (effectContext: AbilityContext) => [context.player, effectContext.source],
                        multipleTrigger: true,
                        gameAction: AbilityDsl.actions.loseHonor()
                    })
                })),
                AbilityDsl.actions.playerLastingEffect((context) => ({
                    targetController: context.player.opponent,
                    effect: AbilityDsl.effects.playerDelayedEffect({
                        when: {
                            onCardAbilityTriggered: (event: EventPayload<EventName.OnCardAbilityTriggered>) =>
                                event.player === context.player.opponent && event.card.type === CardType.Character && !event.card.hasTrait('courtier')
                        },
                        message: '{1} loses 1 honor due to {0}',
                        messageArgs: (effectContext: AbilityContext) => [context.player.opponent, effectContext.source],
                        multipleTrigger: true,
                        gameAction: AbilityDsl.actions.loseHonor()
                    })
                }))
            ]))
            .effect('force honor loss on players when their non-courtier characters use abilities during this conflict')
            .max(AbilityDsl.limit.perConflict(1));
    }
}


export default BreachOfEtiquette;
