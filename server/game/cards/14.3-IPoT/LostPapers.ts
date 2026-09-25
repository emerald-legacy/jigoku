import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class LostPapers extends DrawCard {
    static id = 'lost-papers';

    setupCardAbilities() {
        this.reaction('Bow a character')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .target('target', {
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: (card, context) => {
                    let charactersInPlay = context.game.findAnyCardsInPlay((c: DrawCard) => c.type === CardType.Character);
                    return (card).getFate() === Math.max(...charactersInPlay.map((c: DrawCard) => c.getFate()));
                }
            }, AbilityDsl.actions.bow());
    }
}


export default LostPapers;
