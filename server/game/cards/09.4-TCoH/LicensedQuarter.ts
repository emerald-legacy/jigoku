import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class LicensedQuarter extends DrawCard {
    static id = 'licensed-quarter';

    setupCardAbilities() {
        this.reaction({
            title: 'Discard the top card of your opponents conflict deck',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player
            },
            effect: 'discard the top card of {1}\'s conflict deck',
            effectArgs: context => context.player.opponent,
            gameAction: AbilityDsl.actions.discardCard(context => ({
                target: context.player.opponent && context.player.opponent.conflictDeck[0]
            })),
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }
}


export default LicensedQuarter;

