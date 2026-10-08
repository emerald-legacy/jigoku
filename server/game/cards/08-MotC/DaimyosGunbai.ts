import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { attach, discardCard } from '../../GameActions/GameActions.js';
import { Location, DuelType } from '../../Constants.js';
import { msg } from '../../GameChat.js';

class DaimyosGunbai extends DrawCard {
    static id = 'daimyo-s-gunbai';

    setupCardAbilities() {
        this.action('Initiate a military duel and attach this to the winner')
            .cost(costs.revealCardsOf(context => [context.source]))
            .initiateDuel((context) => ({
                type: DuelType.Military,
                opponentChoosesDuelTarget: true,
                gameAction: duel => attach({
                    target: duel.winner,
                    attachment: context.source
                })
            }))
            .location(Location.Hand)
            .afterwards()
            .gameAction(discardCard((context) => ({ target: context.source.location === Location.Hand ? context.source : [] })))
            .message((context) => context.source.location === Location.Hand ? msg`${context.player} discards ${context.source}` : undefined);
    }
}


export default DaimyosGunbai;
