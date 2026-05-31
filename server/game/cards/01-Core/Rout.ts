import DrawCard from '../../DrawCard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Rout extends DrawCard {
    static id = 'rout';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Send a character home.',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card: any, context: any) => context.player.cardsInPlay.some((myCard: any) => (
                    myCard.hasTrait('bushi') && myCard.isParticipating() &&
                    myCard.militarySkill > card.militarySkill
                )),
                gameAction: ability.actions.sendHome()
            }
        });
    }
}


export default Rout;
