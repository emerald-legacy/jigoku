import DrawCard from '../../drawcard.js';
import { CardTypes, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DisplayOfLoyalty extends DrawCard {
    static id = 'display-of-loyalty';

    setupCardAbilities() {
        this.action({
            title: 'Dishonor a character',
            target: {
                controller: Players.Any,
                cardType: CardTypes.Character,
                cardCondition: (card, context) => {
                    let charactersInPlay = context.game.findAnyCardsInPlay(c => c.type === CardTypes.Character);
                    return card.getFate() === Math.max(...charactersInPlay.map(c => c.getFate()));
                },
                gameAction: AbilityDsl.actions.dishonor()
            }
        });
    }
}


export default DisplayOfLoyalty;
