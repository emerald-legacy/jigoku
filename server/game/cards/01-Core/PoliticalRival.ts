import DrawCard from '../../drawcard.js';

class PoliticalRival extends DrawCard {
    static id = 'political-rival';

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isDefending(),
            effect: ability.effects.modifyPoliticalSkill(3)
        });
    }
}


export default PoliticalRival;
