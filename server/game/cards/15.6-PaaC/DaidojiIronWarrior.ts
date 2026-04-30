import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';

class DaidojiIronWarrior extends DrawCard {
    static id = 'daidoji-iron-warrior';

    setupCardAbilities() {
        this.reaction({
            title: 'Force each player to discard to 4 cards',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isParticipating()
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.chosenDiscard(context => ({
                    target: context.player.opponent,
                    amount: Math.max(0, context.player.opponent.hand.length - 4)
                })),
                AbilityDsl.actions.chosenDiscard(context => ({
                    target: context.player,
                    amount: Math.max(0, context.player.hand.length - 4)
                }))
            ]),
            effect: 'make both players discard down to 4 cards'
        });
    }
}


export default DaidojiIronWarrior;
