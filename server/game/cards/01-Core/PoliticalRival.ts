import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class PoliticalRival extends DrawCard {
    static id = 'political-rival';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isDefending(),
            effect: AbilityDsl.effects.modifyPoliticalSkill(3)
        });
    }
}


export default PoliticalRival;
