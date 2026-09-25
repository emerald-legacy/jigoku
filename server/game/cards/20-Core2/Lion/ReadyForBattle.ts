import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class ReadyForBattle extends DrawCard {
    static id = 'ready-for-battle';

    setupCardAbilities() {
        this.reaction('Ready a character')
            .when({
                onCardBowed: (event, context) =>
                    event.card.controller === context.player &&
                    ((event.context?.source.type as string) === 'ring' ||
                        (context.player.opponent && event.context?.player === context.player.opponent))
            })
            .cannotBeMirrored()
            .gameAction(AbilityDsl.actions.ready((context) => ({ target: context.event.card })));
    }
}
