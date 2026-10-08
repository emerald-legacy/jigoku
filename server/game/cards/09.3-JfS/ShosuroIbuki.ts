import DrawCard from '../../DrawCard.js';

class ShosuroIbuki extends DrawCard {
    static id = 'shosuro-ibuki';

    setupCardAbilities() {
        this.reaction('Remove one fate from each other participating character')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating()
            })
            .removeFate((context) => ({
                target: context.game.currentConflict?.getParticipants((participant) => participant !== context.source) ?? []
            }))
            .chatText('remove one fate from each other participating character');
    }
}


export default ShosuroIbuki;
