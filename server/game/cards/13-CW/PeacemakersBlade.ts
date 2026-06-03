import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class PeacemakersBlade extends DrawCard {
    static id = 'peacemaker-s-blade';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.cardCannot('declareAsAttacker')
        });
    }

    canPlayOn(card: any) {
        return (card.getType() === CardType.Character && !card.isAttacking()) && super.canPlayOn(card);
    }
}


export default PeacemakersBlade;

