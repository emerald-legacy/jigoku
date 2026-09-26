import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Duration } from '../../Constants.js';

class ScoutedTerrain extends DrawCard {
    static id = 'scouted-terrain';

    setupCardAbilities() {
        this.action('Allow attacking the stronghold')
            .condition(context => !!context.player.opponent && context.player.getNumberOfOpponentsFaceupProvinces() >= 4)
            .gameAction(AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player.opponent,
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.strongholdCanBeAttacked()
            })))
            .effect('allow {1}\'s stronghold to be attacked this phase', context => [context.player.opponent]);
    }
}


export default ScoutedTerrain;

