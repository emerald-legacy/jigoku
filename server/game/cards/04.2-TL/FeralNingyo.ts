import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Duration, Location, Element } from '../../Constants.js';
import { delayedEffect } from '../../effects.js';
import { cardLastingEffect, putIntoConflict, returnToDeck, sequential } from '../../GameActions/GameActions.js';

const elementKey = 'feral-ningyo-water';

class FeralNingyo extends DrawCard {
    static id = 'feral-ningyo';

    setupCardAbilities() {
        this.action('Put into play')
            .condition(() => this.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)))
            .gameAction(sequential([
                putIntoConflict((context) => ({
                    target: context.source
                })),
                cardLastingEffect((context) => ({
                    target: context.source,
                    location: [Location.Hand, Location.PlayArea],
                    duration: Duration.UntilEndOfPhase,
                    effect: delayedEffect({
                        when: {
                            onConflictFinished: () => true
                        },
                        message: (context) => msg`${context.source} returns to the deck and shuffles due to its delayed effect`,
                        gameAction: returnToDeck({ shuffle: true })
                    })
                }))
            ]))
            .chatText('{1}return {0} to the deck at the end of the conflict', (context) => [context.source.location !== Location.PlayArea ? ['put {0} into play into the conflict and ', context.source] : ''])
            .location([Location.Hand, Location.PlayArea]);
    }

    getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Conflict Type',
            element: Element.Water
        });
        return symbols;
    }
}


export default FeralNingyo;
