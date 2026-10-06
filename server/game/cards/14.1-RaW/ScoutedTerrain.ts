import DrawCard from '../../DrawCard.js';
import { strongholdCanBeAttacked } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';
import { Duration } from '../../Constants.js';
import { msg } from '../../GameChat.js';

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
            .effect((context) => msg`allow ${context.player.opponent}'s stronghold to be attacked this phase`);
    }
}


export default ScoutedTerrain;

