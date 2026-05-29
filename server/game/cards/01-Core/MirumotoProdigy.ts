import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class MirumotoProdigy extends DrawCard {
    static id = 'mirumoto-prodigy';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            condition: context =>
                context.source.isAttacking() &&
                this.game.currentConflict?.getNumberOfParticipantsFor('attacker') === 1,
            effect: ability.effects.restrictNumberOfDefenders(1)
        });
    }
}


export default MirumotoProdigy;
