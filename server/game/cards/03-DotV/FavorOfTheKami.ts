import DrawCard from '../../drawcard.js';

class FavorOfTheKami extends DrawCard {
    static id = 'favor-of-the-kami';

    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.modifyGlory(1)
        });
    }
}


export default FavorOfTheKami;
