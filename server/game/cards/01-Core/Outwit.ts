import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Outwit extends DrawCard {
    static id = 'outwit';

    setupCardAbilities() {
        this.action('Send a character home')
            .target({
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => context.player.cardsInPlay.some((myCard) => (
                    myCard.hasTrait('courtier') && myCard.isParticipating() &&
                    myCard.politicalSkill > card.politicalSkill
                ))
            }, AbilityDsl.actions.sendHome());
    }
}


export default Outwit;
