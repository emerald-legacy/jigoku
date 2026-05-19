import DrawCard from '../../drawcard.js';

class PitTrap extends DrawCard {
    static id = 'pit-trap';

    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.doesNotReady()
        });
    }

    canPlayOn(card) {
        return card.isAttacking() && super.canPlayOn(card);
    }
}


export default PitTrap;
