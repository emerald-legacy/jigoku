import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class AsakoTakahiro extends DrawCard {
    static id = 'asako-takahiro';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            effect: [
                AbilityDsl.effects.modifyMilitarySkill((card, context) => (2 *
                    context.game.currentConflict
                        .getNumberOfParticipants(card => card.isDishonored && card !== context.source))),
                AbilityDsl.effects.modifyPoliticalSkill((card, context) => (2 *
                    context.game.currentConflict
                        .getNumberOfParticipants(card => card.isHonored && card !== context.source)))
            ]
        });
    }
}


export default AsakoTakahiro;
