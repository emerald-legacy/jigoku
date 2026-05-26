import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

class MinamiKazeRegulars extends DrawCard {
    static id = 'minami-kaze-regulars';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Gain a fate and draw a card',
            when: {
                afterConflict: (event: any, context: any) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating() &&
                    context.game.currentConflict?.hasMoreParticipants(context.player, (() => true) as any)
            },
            gameAction: [
                ability.actions.gainFate(),
                ability.actions.draw()
            ],
            effect: 'gain a fate and draw a card'
        });
    }
}


export default MinamiKazeRegulars;
