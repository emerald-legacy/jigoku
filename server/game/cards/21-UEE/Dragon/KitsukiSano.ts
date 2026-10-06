import { Duration } from '../../../Constants.js';
import { modifyDuelSkill } from '../../../effects.js';
import { chosenDiscard, draw, duelLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class KitsukiSano extends DrawCard {
    static id = 'kitsuki-sano';

    public setupCardAbilities() {
        this.duelChallenge('Punish the injust', (duel, context) =>
            duel.participants.includes(context.source) &&
                duel.participants.some(
                    (participant) => participant.controller === context.player.opponent && participant.isDishonored
                ))
            .gameAction(duelLastingEffect((context) => ({
                target: context.event.duel,
                effect: modifyDuelSkill({
                    amount: 2,
                    player: context.player
                }),
                duration: Duration.UntilEndOfDuel
            })))
            .effect('add 2 to their duel total');

        this.action('Draw 2 cards, discard 2 cards')
            .condition((context) =>
                context.source.isAttacking() && context.game.requireConflict().defenders.length === 0)
            .gameAction(draw({ amount: 2 }))
            .then(() => ({
                gameAction: chosenDiscard((context) => ({
                    targets: false,
                    target: context.player,
                    amount: 2
                }))
            }));
    }
}
