import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class AsakoTakahiro extends DrawCard {
    static id = 'asako-takahiro';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            effect: [
                AbilityDsl.effects.modifyMilitarySkill((_card, context) => (2 *
                    (context.game.currentConflict
                        ?.getNumberOfParticipants((card) => card.isDishonored && card !== context.source) ?? 0))),
                AbilityDsl.effects.modifyPoliticalSkill((_card, context) => (2 *
                    (context.game.currentConflict
                        ?.getNumberOfParticipants((card) => card.isHonored && card !== context.source) ?? 0)))
            ]
        });
    }
}


export default AsakoTakahiro;
