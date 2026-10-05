import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class HeartlessIntimidator extends DrawCard {
    static id = 'heartless-intimidator';

    setupCardAbilities() {
        this.reaction('Force opponent to discard 1 card')
            .when({
                onModifyHonor: (event, context) => event.player === context.player.opponent && event.amount < 0,
                onTransferHonor: (event, context) => event.player === context.player.opponent && event.amount > 0
            })
            .gameAction(AbilityDsl.actions.discardCard((context) => ({
                target: context.player.opponent ? context.player.opponent.conflictDeck[0] : []
            })))
            .effect('discard the top card of {1}\'s conflict deck', context => context.player.opponent ?? context.player)
            .limit(AbilityDsl.limit.unlimited());
    }
}


export default HeartlessIntimidator;
