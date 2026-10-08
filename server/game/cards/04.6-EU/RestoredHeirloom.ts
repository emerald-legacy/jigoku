import DrawCard from '../../DrawCard.js';
import { attach, cancel } from '../../GameActions/GameActions.js';
import { Location, Players, CardType, Element } from '../../Constants.js';

const elementKey = 'restored-heirloom-water';

class RestoredHeirloom extends DrawCard {
    static id = 'restored-heirloom';

    setupCardAbilities() {
        this.wouldInterrupt('Put into play')
            .when({
                onResolveRingElement: (event, context) => event.ring.element === this.getCurrentElementSymbol(elementKey) && event.player === context.player
            })
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, cancel((context) => ({
                replacementGameAction: attach({ attachment: context.source })
            })))
            .chatText('attach {1} to {0} instead of resolving the {2}', context => [context.source, context.event.ring])
            .location([Location.Hand,Location.ConflictDiscardPile]);
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


export default RestoredHeirloom;
