import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Rout extends DrawCard {
    static id = 'rout';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Send a character home.')
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => context.player.cardsInPlay.some((myCard: DrawCard) => (
                    myCard.hasTrait('bushi') && myCard.isParticipating() &&
                    myCard.militarySkill > card.militarySkill
                ))
            }, ability.actions.sendHome());
    }
}


export default Rout;
