import DrawCard from '../../DrawCard.js';
import { bow, cancel, multiple, ready, selectCard } from '../../GameActions/GameActions.js';
import { CardType, Element } from '../../Constants.js';

const elementKey = 'asako-azunami-water';

class AsakoAzunami extends DrawCard {
    static id = 'asako-azunami';

    setupCardAbilities() {
        this.wouldInterrupt('Bow and ready two characters instead of the ring effect')
            .when({
                onResolveRingElement: (event, context) => event.ring.element === this.getCurrentElementSymbol(elementKey) && event.player === context.player
            })
            .gameAction(cancel(context => ({
                replacementGameAction: multiple([
                    selectCard({
                        activePromptTitle: 'Choose a character to bow',
                        cardType: CardType.Character,
                        optional: true,
                        gameAction: bow(),
                        targets: true,
                        message: '{0} chooses to bow {1} with {2}\'s effect',
                        messageArgs: (card, player) => [player, card, context.source]
                    }),
                    selectCard({
                        activePromptTitle: 'Choose a character to ready',
                        cardType: CardType.Character,
                        optional: true,
                        gameAction: ready(),
                        targets: true,
                        message: '{0} chooses to ready {1} with {2}\'s effect',
                        messageArgs: (card, player) => [player, card, context.source]
                    })
                ])
            })))
            .effect('replace the {1} ring effect with bowing and readying two characters', () => [this.getCurrentElementSymbol(elementKey)]);
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Resolved Ring',
            element: Element.Water
        });
        return symbols;
    }
}


export default AsakoAzunami;
