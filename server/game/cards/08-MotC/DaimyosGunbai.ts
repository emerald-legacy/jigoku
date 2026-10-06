import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { attach, discardCard } from '../../GameActions/GameActions.js';
import { Location, DuelType } from '../../Constants.js';

class DaimyosGunbai extends DrawCard {
    static id = 'daimyo-s-gunbai';

    setupCardAbilities() {
        this.action('Initiate a military duel and attach this to the winner')
            .cost(AbilityDsl.costs.reveal(context => [context.source]))
            .initiateDuel((context) => ({
                type: DuelType.Military,
                opponentChoosesDuelTarget: true,
                gameAction: duel => attach({
                    target: duel.winner,
                    attachment: context.source
                })
            }))
            .then(() => ({
                thenCondition: () => true,
                gameAction: discardCard(context => ({
                    target: context.source.location === Location.Hand ? context.source : []
                })),
                message: (context) => context.source.location === Location.Hand ? '{0} discards {1}' : ''
            }))
            .location(Location.Hand);
    }
}


export default DaimyosGunbai;
