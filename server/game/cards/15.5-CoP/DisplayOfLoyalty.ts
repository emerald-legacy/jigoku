import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class DisplayOfLoyalty extends DrawCard {
    static id = 'display-of-loyalty';

    setupCardAbilities() {
        this.action('Dishonor a character')
            .target('target', {
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: (card, context) => {
                    const charactersInPlay = context.game.findAnyCardsInPlay((c: DrawCard) => c.type === CardType.Character);
                    return card.getFate() === Math.max(...charactersInPlay.map((c: DrawCard) => c.getFate()));
                }
            }, AbilityDsl.actions.dishonor());
    }
}


export default DisplayOfLoyalty;
