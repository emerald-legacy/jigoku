import DrawCard from '../../DrawCard.js';
import { strongholdCanBeAttacked } from '../../effects.js';
import { Duration, Phase } from '../../Constants.js';
import { msg } from '../../GameChat.js';

class ScoutedTerrain extends DrawCard {
    static id = 'scouted-terrain';

    setupCardAbilities() {
        this.action('Allow attacking the stronghold')
            .condition((context) => !!context.player.opponent && context.player.getNumberOfOpponentsFaceupProvinces() >= 4)
            .phase(Phase.Conflict)
            .playerLastingEffect((context) => ({
                target: context.player.opponent,
                duration: Duration.UntilEndOfPhase,
                effect: strongholdCanBeAttacked()
            }))
            .chatText((context) => msg`allow ${context.player.opponent}'s stronghold to be attacked this phase`);
    }
}


export default ScoutedTerrain;

