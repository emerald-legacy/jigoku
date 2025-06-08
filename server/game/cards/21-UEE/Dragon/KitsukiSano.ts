import { Durations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import type { Conflict } from '../../../conflict';

export default class KitsukiSano extends DrawCard {
    static id = 'kitsuki-sano';

    public setupCardAbilities() {
        this.duelChallenge({
            title: 'Punish the injust',
            duelCondition: (duel, context) =>
                duel.participants.includes(context.source) &&
                duel.participants.some(
                    (participant) => participant.controller === context.player.opponent && participant.isDishonored
                ),
            gameAction: AbilityDsl.actions.duelLastingEffect((context) => ({
                target: (context as any).event.duel,
                effect: AbilityDsl.effects.modifyDuelSkill({
                    amount: 2,
                    player: context.player
                }),
                duration: Durations.UntilEndOfDuel
            })),
            effect: 'add 2 to their duel total'
        });

        this.action({
            title: 'Draw 2 cards, discard 2 cards',
            condition: (context) =>
                context.source.isAttacking() && (context.game.currentConflict as Conflict).defenders.length === 0,
            gameAction: AbilityDsl.actions.draw((context) => ({ target: context.player, amount: 2 })),
            then: {
                gameAction: AbilityDsl.actions.chosenDiscard((context) => ({
                    targets: false,
                    target: context.player,
                    amount: 2
                }))
            }
        });
    }
}
