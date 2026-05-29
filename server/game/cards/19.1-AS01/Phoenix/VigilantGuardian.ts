import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class VigilantGuardian extends DrawCard {
    static id = 'vigilant-guardian';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isDefending() && (context.game.currentConflict?.attackerSkill ?? -1) === 0,
            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}
