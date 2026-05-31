import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class PoliticalRival extends DrawCard {
    static id = 'political-rival';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.persistentEffect({
            condition: context => context.source.isDefending(),
            effect: ability.effects.modifyPoliticalSkill(3)
        });
    }
}


export default PoliticalRival;
