import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class ShosuroIbuki extends DrawCard {
    static id = 'shosuro-ibuki';

    setupCardAbilities() {
        this.reaction({
            title: 'Remove one fate from each other participating character',
            when: {
                afterConflict: (event: any, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating()
            },
            gameAction: AbilityDsl.actions.removeFate(context => ({
                target: context.game.currentConflict?.getParticipants((participant: any) => participant !== context.source) ?? []
            })),
            effect: 'remove one fate from each other participating character'
        });
    }
}


export default ShosuroIbuki;
