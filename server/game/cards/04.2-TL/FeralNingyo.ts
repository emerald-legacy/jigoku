import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location, Element } from '../../Constants.js';
import { atEndOfConflict, putIntoConflict, returnToDeck, sequential } from '../../GameActions/GameActions.js';

const elementKey = 'feral-ningyo-water';

class FeralNingyo extends DrawCard {
    static id = 'feral-ningyo';

    override setupCardAbilities() {
        this.action('Put into play')
            .condition(() => this.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)))
            // also while in play, when it was played normally: then it only returns at the end of the conflict
            .location([Location.Hand, Location.PlayArea])
            .gameAction(sequential([
                putIntoConflict((context) => ({
                    target: context.source
                })),
                atEndOfConflict((context) => ({
                    target: context.source,
                    message: (context) => msg`${context.source} returns to the deck and shuffles due to its delayed effect`,
                    gameAction: returnToDeck({ shuffle: true })
                }))
            ]))
            .chatText((context) => context.source.location === Location.PlayArea
                ? msg`return ${context.source} to the deck at the end of the conflict`
                : msg`put ${context.source} into play into the conflict and return ${context.chatTarget()} to the deck at the end of the conflict`);
    }

    override getPrintedElementSymbols() {
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
