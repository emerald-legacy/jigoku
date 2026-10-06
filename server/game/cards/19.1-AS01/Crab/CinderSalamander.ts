import { CardType, Decks, Element, Location, Players, TargetMode } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { deckSearch, moveCard, multiple, putIntoPlay, selectCards } from '../../../GameActions/GameActions.js';
import type BaseCard from '../../../BaseCard.js';
import DrawCard from '../../../DrawCard.js';
import { claimedRingSymbols, hasClaimedRing } from '../../claimedRings.js';

const elementSymbol = { key: 'cinder-salamander-fire', element: Element.Fire };

export default class CinderSalamander extends DrawCard {
    static id = 'cinder-salamander';

    public setupCardAbilities() {
        this.reaction('Shuffle this character back into the deck')
            .when({
                onCardLeavesPlay: (event, context) => event.card === context.source
            })
            .gameAction(moveCard({
                destination: Location.DynastyDeck,
                shuffle: true
            }))
            .location(Location.DynastyDiscardPile);

        this.action('Search other copies of this character and put them into play')
            .condition((context) => hasClaimedRing(this, elementSymbol.key, context.player))
            .gameAction(multiple([
                deckSearch({
                    activePromptTitle: 'Select characters to put into play from your deck',
                    deck: Decks.DynastyDeck,
                    targetMode: TargetMode.UpTo,
                    numCards: 3,
                    cardCondition: (card) => this.isSalamanderCard(card),
                    shuffle: true,
                    gameAction: putIntoPlay(),
                    message: '{0} finds {1} in their deck',
                    messageArgs: (context, cards) => [context.player, this.salamanderCountToText(cards.length)]
                }),
                selectCards({
                    activePromptTitle: 'Select characters to put into play from your provinces',
                    controller: Players.Self,
                    cardType: CardType.Character,
                    location: Location.Provinces,
                    mode: TargetMode.UpTo,
                    numCards: 3,
                    cardCondition: (card) => this.isSalamanderCard(card),
                    gameAction: putIntoPlay(),
                    message: '{0} finds {1} in their provinces',
                    messageArgs: (cards, player) => [player, this.salamanderCountToText(cards.length)]
                })
            ]))
            .effect('search their deck and provinces for other copies of {0} and put them into play')
            .max(AbilityDsl.limit.perRound(1));
    }

    public getPrintedElementSymbols() {
        return [...super.getPrintedElementSymbols(), ...claimedRingSymbols([elementSymbol])];
    }

    private isSalamanderCard(card: BaseCard): boolean {
        return card.id === this.id;
    }

    private salamanderCountToText(salamanderCount: number): string {
        return salamanderCount > 1
            ? salamanderCount + ' salamanders'
            : salamanderCount === 1
                ? '1 salamander'
                : 'no salamanders';
    }
}
