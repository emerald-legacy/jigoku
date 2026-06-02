import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, Players, CardType, Element } from '../../Constants.js';

const elementKey = 'restored-heirloom-water';

class RestoredHeirloom extends DrawCard {
    static id = 'restored-heirloom';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Put into play',
            when: {
                onResolveRingElement: (event, context) => !!event.ring && event.ring.element === this.getCurrentElementSymbol(elementKey) && event.player === context.player
            },
            effect: 'attach {1} to {0} instead of resolving the {2}',
            effectArgs: context => [context.source, context.event.ring],
            location: [Location.Hand,Location.ConflictDiscardPile],
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.cancel(context => ({
                    replacementGameAction: AbilityDsl.actions.attach({ attachment: context.source })
                }))
            }
        });
    }


    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Resolved Ring',
            element: Element.Water
        });
        return symbols;
    }
}


export default RestoredHeirloom;
