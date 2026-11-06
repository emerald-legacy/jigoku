import { msg } from '../../../GameChat.js';
import { CardType, DeckType, Element, Location, Players, TargetMode } from '../../../Constants.js';
import { perRound } from '../../../AbilityLimit.js';
import { putIntoPlay } from '../../../GameActions/GameActions.js';
import type BaseCard from '../../../BaseCard.js';
import DrawCard from '../../../DrawCard.js';
import { claimedRingSymbols, hasClaimedRing } from '../../claimedRings.js';

const elementSymbol = { key: 'cinder-salamander-fire', element: Element.Fire };

/** "Copies of this card": the same title as the card using the ability (one that gained it too). */
function isCopyOf(card: BaseCard, source: BaseCard): boolean {
    return card.name === source.name;
}

export default class CinderSalamander extends DrawCard {
    static id = 'cinder-salamander';

    public override setupCardAbilities() {
        this.reaction('Shuffle this character back into the deck')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source
            })
            .location(Location.DynastyDiscardPile)
            .moveCard({
                destination: Location.DynastyDeck,
                shuffle: true
            });

        this.action('Search other copies of this character and put them into play')
            .ifCondition((context) => hasClaimedRing(this, elementSymbol.key, context.player))
            .deckSearch({
                activePromptTitle: 'Select characters to put into play from your deck',
                deck: DeckType.Dynasty,
                mode: TargetMode.UpTo,
                numCards: 3,
                cardCondition: (card, context) => isCopyOf(card, context.source),
                gameAction: putIntoPlay(),
                message: (context, cards) => msg`${context.player} finds ${this.salamanderCountToText(cards.length)} in their deck`
            })
            .selectCards({
                activePromptTitle: 'Select characters to put into play from your provinces',
                controller: Players.Self,
                cardType: CardType.Character,
                location: Location.Provinces,
                mode: TargetMode.UpTo,
                numCards: 3,
                cardCondition: (card, context) => isCopyOf(card, context.source),
                gameAction: putIntoPlay(),
                message: (_context, cards, player) => msg`${player} finds ${this.salamanderCountToText(cards.length)} in their provinces`
            })
            .chatText('search their deck and provinces for other copies of {0} and put them into play')
            .max(perRound(1));
    }

    protected override printedElementSymbols = claimedRingSymbols([elementSymbol]);

    private salamanderCountToText(salamanderCount: number): string {
        return salamanderCount > 1
            ? salamanderCount + ' salamanders'
            : salamanderCount === 1
                ? '1 salamander'
                : 'no salamanders';
    }
}
