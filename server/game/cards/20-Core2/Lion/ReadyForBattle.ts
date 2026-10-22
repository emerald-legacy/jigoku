import DrawCard from '../../../DrawCard.js';

export default class ReadyForBattle extends DrawCard {
    static id = 'ready-for-battle';

    override setupCardAbilities() {
        this.reaction('Ready a character')
            .when({
                onCardBowed: (event, context) =>
                    event.card.controller === context.player &&
                    (event.context?.source.isRing() ||
                        (context.player.opponent && event.context?.player === context.player.opponent))
            })
            .ready((context) => ({ target: context.event.card }))
            .cannotBeMirrored();
    }
}
