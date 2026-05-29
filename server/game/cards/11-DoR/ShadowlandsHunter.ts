import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class ShadowlandsHunter extends DrawCard {
    static id = 'shadowlands-hunter';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking() && this.game.currentConflict?.winner === context.player,
            effect: AbilityDsl.effects.forceConflictUnopposed()
        });
    }
}


export default ShadowlandsHunter;


