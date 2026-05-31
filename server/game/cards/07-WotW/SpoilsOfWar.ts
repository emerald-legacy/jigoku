import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class SpoilsOfWar extends DrawCard {
    static id = 'spoils-of-war';

    setupCardAbilities() {
        this.reaction({
            title: 'Draw 3 cards and discard 1',
            max: AbilityDsl.limit.perConflict(1),
            when: {
                afterConflict: (event, context) => event.conflict.conflictType === 'military' &&
                                                   event.conflict.winner === context.player &&
                                                   context.player.isAttackingPlayer()
            },
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.draw(context => ({ target: context.player, amount: 3 })),
                AbilityDsl.actions.chosenDiscard(context => ({ target: context.player }))
            ]),
            effect: 'draw 3 cards, then discard 1'
        });
    }
}


export default SpoilsOfWar;
