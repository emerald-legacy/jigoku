import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class HeartlessIntimidator extends DrawCard {
    static id = 'heartless-intimidator';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Force opponent to discard 1 card')
            .when({
                onModifyHonor: (event, context) => event.player === context.player.opponent && (event.amount ?? 0) < 0,
                onTransferHonor: (event, context) => event.player === context.player.opponent && (event.amount ?? 0) > 0
            })
            .gameAction(ability.actions.discardCard((context) => ({
                target: context.player.opponent ? context.player.opponent.conflictDeck[0] : []
            })))
            .effect('discard the top card of {1}\'s conflict deck', context => context.player.opponent ?? context.player)
            .limit(ability.limit.perPhase(Infinity));
    }
}


export default HeartlessIntimidator;
