import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class FavorOfTheKami extends DrawCard {
    static id = 'favor-of-the-kami';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.whileAttached({
            effect: ability.effects.modifyGlory(1)
        });
    }
}


export default FavorOfTheKami;
