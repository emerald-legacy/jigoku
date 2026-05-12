import DrawCard from '../../drawcard';
import { Players, CardTypes } from '../../Constants';

class Outwit extends DrawCard {
    static id = 'outwit';

    setupCardAbilities(ability) {
        this.action({
            title: 'Send a character home.',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card, context) => context.player.cardsInPlay.some(myCard => (
                    myCard.hasTrait('courtier') && myCard.isParticipating() &&
                    myCard.politicalSkill > card.politicalSkill
                )),
                gameAction: ability.actions.sendHome()
            }
        });
    }
}


export default Outwit;
