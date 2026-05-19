import DrawCard from '../../drawcard.js';

class BlessedByFukurokujin extends DrawCard {
    static id = 'blessed-by-fukurokujin';

    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.cardCannot('receiveDishonorToken')
        });
    }
}


export default BlessedByFukurokujin;
