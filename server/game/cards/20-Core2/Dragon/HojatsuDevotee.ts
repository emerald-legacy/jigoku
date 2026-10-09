import { DuelType } from '../../../Constants.js';
import { discardFromPlay } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class HojatsuDevotee extends DrawCard {
    static id = 'hojatsu-devotee';

    public setupCardAbilities() {
        this.interrupt('Initiate a military duel, discarding the loser')
            .when({
                onCardLeavesPlay: (event, context) =>
                    event.card === context.source && event.context?.player === context.player.opponent
            })
            .initiateDuel(() => ({
                type: DuelType.Military,
                requiresConflict: false,
                gameAction: (duel) => discardFromPlay({ target: duel.loser })
            }));
    }
}
