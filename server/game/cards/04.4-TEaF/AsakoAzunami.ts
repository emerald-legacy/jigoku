import DrawCard from '../../DrawCard.js';
import { bow, multiple, ready, selectCard } from '../../GameActions/GameActions.js';
import { CardType, Element } from '../../Constants.js';
import { msg } from '../../GameChat.js';

const elementKey = 'asako-azunami-water';

class AsakoAzunami extends DrawCard {
    static id = 'asako-azunami';

    override setupCardAbilities() {
        this.wouldInterrupt('Bow and ready two characters instead of the ring effect')
            .when({
                onResolveRingElement: (event, context) => event.ring.element === this.getCurrentElementSymbol(elementKey) && event.player === context.player
            })
            .cancel({
                replacementGameAction: multiple([
                    selectCard({
                        activePromptTitle: 'Choose a character to bow',
                        cardType: CardType.Character,
                        optional: true,
                        gameAction: bow(),
                        targets: true,
                        message: (context, card, player) => msg`${player} chooses to bow ${card} with ${context.source}'s effect`
                    }),
                    selectCard({
                        activePromptTitle: 'Choose a character to ready',
                        cardType: CardType.Character,
                        optional: true,
                        gameAction: ready(),
                        targets: true,
                        message: (context, card, player) => msg`${player} chooses to ready ${card} with ${context.source}'s effect`
                    })
                ])
            })
            .chatText(() => msg`replace the ${this.getCurrentElementSymbol(elementKey)} ring effect with bowing and readying two characters`);
    }

    protected override printedElementSymbols = [
        {
            key: elementKey,
            prettyName: 'Resolved Ring',
            element: Element.Water
        }
    ];
}


export default AsakoAzunami;
