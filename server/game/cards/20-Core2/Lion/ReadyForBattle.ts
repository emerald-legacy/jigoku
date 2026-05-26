import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class ReadyForBattle extends DrawCard {
    static id = 'ready-for-battle';

    setupCardAbilities() {
        this.reaction({
            title: 'Ready a character',
            when: {
                onCardBowed: (event, context) =>
                    event.card.controller === context.player &&
                    (event.context?.source.type === 'ring' ||
                        (context.player.opponent && event.context?.player === context.player.opponent))
            },
            cannotBeMirrored: true,
            gameAction: AbilityDsl.actions.ready((context) => ({ target: (context as any).event.card }))
        });
    }
}
