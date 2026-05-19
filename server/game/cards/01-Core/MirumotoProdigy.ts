import DrawCard from '../../drawcard.js';

class MirumotoProdigy extends DrawCard {
    static id = 'mirumoto-prodigy';

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context =>
                context.source.isAttacking() &&
                this.game.currentConflict.getNumberOfParticipantsFor('attacker') === 1,
            effect: ability.effects.restrictNumberOfDefenders(1)
        });
    }
}


export default MirumotoProdigy;
