import DrawCard from '../../DrawCard.js';
import { strongholdCanBeAttacked } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';
import { Duration } from '../../Constants.js';

class ScoutedTerrain extends DrawCard {
    static id = 'scouted-terrain';

    setupCardAbilities() {
        this.action('Allow attacking the stronghold')
            .condition(context => !!context.player.opponent && context.player.getNumberOfOpponentsFaceupProvinces() >= 4)
            .gameAction(playerLastingEffect(context => ({
                targetController: context.player.opponent,
                duration: Duration.UntilEndOfPhase,
                effect: strongholdCanBeAttacked()
            })))
            .effect('allow {1}\'s stronghold to be attacked this phase', context => [context.player.opponent]);
    }
}


export default ScoutedTerrain;

