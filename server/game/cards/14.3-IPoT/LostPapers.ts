import DrawCard from '../../drawcard.js';
import { CardTypes, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class LostPapers extends DrawCard {
    static id = 'lost-papers';

    setupCardAbilities() {
        this.reaction({
            title: 'Bow a character',
            when: {
                onCardRevealed: (event, context) => event.card === context.source
            },
            target: {
                controller: Players.Any,
                cardType: CardTypes.Character,
                cardCondition: (card, context) => {
                    let charactersInPlay = context.game.findAnyCardsInPlay((c: any) => c.type === CardTypes.Character);
                    return card.getFate() === Math.max(...charactersInPlay.map((c: any) => c.getFate()));
                },
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}


export default LostPapers;
