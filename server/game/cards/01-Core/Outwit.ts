import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Outwit extends DrawCard {
    static id = 'outwit';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Send a character home.',
            target: {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card: any, context: any) => context.player.cardsInPlay.some((myCard: any) => (
                    myCard.hasTrait('courtier') && myCard.isParticipating() &&
                    myCard.politicalSkill > card.politicalSkill
                )),
                gameAction: ability.actions.sendHome()
            }
        });
    }
}


export default Outwit;
