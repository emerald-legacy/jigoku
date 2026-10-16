import { modifyDuelTotal } from '../../../effects.js';
import DrawCard from '../../../DrawCard.js';

export default class KitsukiSano extends DrawCard {
    static id = 'kitsuki-sano';

    public override setupCardAbilities() {
        this.duelChallenge('Punish the injust', (duel, context) =>
            duel.participants.includes(context.source) &&
                duel.participants.some(
                    (participant) => participant.controller === context.player.opponent && participant.isDishonored
                ))
            .duelLastingEffect((context) => ({
                effect: modifyDuelTotal({
                    amount: 2,
                    player: context.player
                })
            }))
            .chatText('add 2 to their duel total');

        this.conflictAction('Draw 2 cards, discard 2 cards')
            .condition((context) =>
                context.source.isAttacking() && context.game.requireConflict().defenders.length === 0)
            .draw(2)
            .afterwards()
            .chosenDiscard((context) => ({ targets: false, target: context.player, amount: 2 }));
    }
}
