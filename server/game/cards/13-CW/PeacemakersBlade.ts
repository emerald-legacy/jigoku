import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes } from '../../Constants.js';

class PeacemakersBlade extends DrawCard {
    static id = 'peacemaker-s-blade';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.cardCannot('declareAsAttacker')
        });
    }

    canPlayOn(card: any) {
        return (card.getType() === CardTypes.Character && !card.isAttacking()) && super.canPlayOn(card);
    }
}


export default PeacemakersBlade;

