import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class AsakoTakahiro extends DrawCard {
    static id = 'asako-takahiro';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            effect: [
                AbilityDsl.effects.modifyMilitarySkill((card, context) => (2 *
                    context.game.currentConflict
                        .getNumberOfParticipants((card: DrawCard) => card.isDishonored && card !== context.source))),
                AbilityDsl.effects.modifyPoliticalSkill((card, context) => (2 *
                    context.game.currentConflict
                        .getNumberOfParticipants((card: DrawCard) => card.isHonored && card !== context.source)))
            ]
        });
    }
}


export default AsakoTakahiro;
