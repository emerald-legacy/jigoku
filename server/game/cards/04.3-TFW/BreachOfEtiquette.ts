import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes } from '../../Constants.js';

class BreachOfEtiquette extends DrawCard {
    static id = 'breach-of-etiquette';

    setupCardAbilities() {
        this.action({
            title: 'Force honor loss on players when their non-courtier characters use abilities',
            condition: () => this.game.isDuringConflict('political'),
            max: AbilityDsl.limit.perConflict(1),
            effect: 'force honor loss on players when their non-courtier characters use abilities during this conflict',
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.playerLastingEffect(context => ({
                    targetController: context.player,
                    effect: AbilityDsl.effects.playerDelayedEffect({
                        when: {
                            onCardAbilityTriggered: event =>
                                event.player === context.player && event.card.type === CardTypes.Character && !event.card.hasTrait('courtier')
                        },
                        message: '{1} loses 1 honor due to {0}',
                        messageArgs: effectContext => [context.player, effectContext.source],
                        multipleTrigger: true,
                        gameAction: AbilityDsl.actions.loseHonor()
                    })
                })),
                AbilityDsl.actions.playerLastingEffect(context => ({
                    targetController: context.player.opponent,
                    effect: AbilityDsl.effects.playerDelayedEffect({
                        when: {
                            onCardAbilityTriggered: event =>
                                event.player === context.player.opponent && event.card.type === CardTypes.Character && !event.card.hasTrait('courtier')
                        },
                        message: '{1} loses 1 honor due to {0}',
                        messageArgs: effectContext => [context.player.opponent, effectContext.source],
                        multipleTrigger: true,
                        gameAction: AbilityDsl.actions.loseHonor()
                    })
                }))
            ])
        });
    }
}


export default BreachOfEtiquette;
