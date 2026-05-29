import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class DojiRepresentative extends DrawCard {
    static id = 'doji-representative';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Move this character home',
            gameAction: ability.actions.sendHome()
        });
    }
}


export default DojiRepresentative;
