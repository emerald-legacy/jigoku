import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class AsakoTakahiro extends DrawCard {
    static id = 'asako-takahiro';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            effect: [
                AbilityDsl.effects.modifyMilitarySkill((card: any, context: any) => (2 *
                    context.game.currentConflict
                        .getNumberOfParticipants((card: any) => card.isDishonored && card !== context.source))),
                AbilityDsl.effects.modifyPoliticalSkill((card: any, context: any) => (2 *
                    context.game.currentConflict
                        .getNumberOfParticipants((card: any) => card.isHonored && card !== context.source)))
            ]
        });
    }
}


export default AsakoTakahiro;
