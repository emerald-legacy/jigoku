import DrawCard from '../../drawcard';
import { Players, CardTypes } from '../../Constants';

class Rout extends DrawCard {
    static id = 'rout';

    setupCardAbilities(ability) {
        this.action({
            title: 'Send a character home.',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => context.player.cardsInPlay.some(myCard => (
                    myCard.hasTrait('bushi') && myCard.isParticipating() &&
                    myCard.militarySkill > card.militarySkill
                )),
                gameAction: ability.actions.sendHome()
            }
        });
    }
}


export default Rout;
