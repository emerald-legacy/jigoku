import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import AbilityDsl from '../../abilitydsl.js';
import { Duration } from '../../Constants.js';

class ScoutedTerrain extends DrawCard {
    static id = 'scouted-terrain';

    setupCardAbilities() {
        this.action({
            title: 'Allow attacking the stronghold',
            condition: context => !!context.player.opponent && context.player.getNumberOfOpponentsFaceupProvinces() >= 4,
            effect: 'allow {1}\'s stronghold to be attacked this phase',
            effectArgs: context => [context.player.opponent as Player],
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player.opponent,
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.strongholdCanBeAttacked()
            }))
        });
    }
}


export default ScoutedTerrain;

