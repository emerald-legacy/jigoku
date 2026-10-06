import { draw, gainFate } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

class MinamiKazeRegulars extends DrawCard {
    static id = 'minami-kaze-regulars';

    setupCardAbilities() {
        this.reaction('Gain a fate and draw a card')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating() &&
                    context.game.currentConflict?.hasMoreParticipants(context.player)
            })
            .gameAction(gainFate(), draw())
            .effect('gain a fate and draw a card');
    }
}


export default MinamiKazeRegulars;
