import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class MaliciousTimekeeper extends DrawCard {
    static id = 'malicious-timekeeper';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isAttacking() && this.game.currentConflict?.winner === context.player,
            effect: AbilityDsl.effects.forceConflictUnopposed()
        });
    }
}
