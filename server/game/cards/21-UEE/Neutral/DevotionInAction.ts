import { CardTypes, Durations, Locations, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class DevotionInAction extends DrawCard {
    static id = 'devotion-in-action';

    setupCardAbilities() {
        this.action({
            title: 'Put a character into play',
            condition: (context) =>
                context.game.isDuringConflict() &&
        context.player.opponent &&
        context.game.currentConflict.hasMoreParticipants(context.player.opponent),
            target: {
                cardType: CardTypes.Character,
                location: [Locations.Provinces, Locations.Hand],
                controller: Players.Self,
                cardCondition: (card) => card instanceof DrawCard && card.hasTrait('bushi') && card.printedCost <= 3,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.putIntoConflict((context) => ({
                        target: context.target,
                        status: context.target.hasTrait('yojimbo') ? 'honored' : 'ordinary'
                    })),
                    AbilityDsl.actions.cardLastingEffect((context) => ({
                        target: context.target,
                        duration: Durations.UntilEndOfPhase,
                        effect: [
                            AbilityDsl.effects.delayedEffect({
                                when: { onConflictFinished: () => true },
                                message: '{1} is discarded from play due to the delayed effect of {0} - their duty is over',
                                messageArgs: [context.source, context.target],
                                gameAction: AbilityDsl.actions.sacrifice({ target: context.target })
                            })
                        ]
                    }))
                ])
            }
        });
    }
}
