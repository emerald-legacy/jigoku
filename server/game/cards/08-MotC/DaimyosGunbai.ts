import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, DuelTypes } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';

class DaimyosGunbai extends DrawCard {
    static id = 'daimyo-s-gunbai';

    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel and attach this to the winner',
            cost: AbilityDsl.costs.reveal(context => context.source),
            location: Locations.Hand,
            initiateDuel: {
                type: DuelTypes.Military,
                opponentChoosesDuelTarget: true,
                gameAction: duel => AbilityDsl.actions.attach(context => ({
                    target: duel.winner,
                    attachment: context.source
                }))
            },
            then: {
                thenCondition: () => true,
                gameAction: AbilityDsl.actions.discardCard(context => ({
                    target: context.source.location === Locations.Hand ? context.source : []
                })),
                message: (context: AbilityContext) => context.source.location === Locations.Hand ? '{0} discards {1}' : null
            }
        });
    }
}


export default DaimyosGunbai;
