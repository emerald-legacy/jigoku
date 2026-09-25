import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class CelebratedRenown extends DrawCard {
    static id = 'celebrated-renown';

    setupCardAbilities() {
        this.action('Honor a character')
            .target('target', {
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: (card, context) => {
                    let charactersInPlay = context.game.findAnyCardsInPlay((c: DrawCard) => c.type === CardType.Character);
                    return card.getFate() === Math.max(...charactersInPlay.map((c: DrawCard) => c.getFate()));
                }
            }, AbilityDsl.actions.honor());
    }
}


export default CelebratedRenown;
