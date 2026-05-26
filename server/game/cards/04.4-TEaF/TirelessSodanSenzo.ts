import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

class TirelessSodanSenzo extends DrawCard {
    static id = 'tireless-sodan-senzo';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => {
                const conflict = this.game.currentConflict;
                return context.source.isParticipating() && conflict !== null && conflict.loser === context.player;
            },
            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}


export default TirelessSodanSenzo;
