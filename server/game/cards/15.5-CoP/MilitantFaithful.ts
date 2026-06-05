import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';


class MilitantFaithful extends DrawCard {
    static id = 'militant-faithful';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => !!(context.player.opponent && context.player.opponent.anyCardsInPlay(card => card.isParticipating() && !card.isOrdinary())),
            effect: AbilityDsl.effects.doesNotBow()
        });
    }
}


export default MilitantFaithful;
