import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class VigilantGuardian extends DrawCard {
    static id = 'vigilant-guardian';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isDefending() && context.game.currentConflict.attackerSkill === 0,
            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}
