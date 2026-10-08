import { CardType, DeckType, PlayType } from '../../../Constants.js';
import { PlayCharacterAsIfFromHandAtHome } from '../../../PlayCharacterAsIfFromHand.js';
import { PlayDisguisedCharacterAsIfFromHandAtHome } from '../../../PlayDisguisedCharacterAsIfFromHand.js';
import { playCard } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { article } from '../../article.js';

export default class UtakuTakeko extends DrawCard {
    static id = 'utaku-takeko';

    public setupCardAbilities() {
        this.action('Play a character from your dynasty deck')
            .deckSearch(() => ({
                activePromptTitle: 'Select a character to play',
                cardsToLookAt: 8,
                deck: DeckType.Dynasty,
                cardCondition: (card) =>
                    card.type === CardType.Character &&
                    card.glory >= 1 &&
                    card.isFaction('unicorn') &&
                    !card.isUnique(),
                gameAction: playCard((context) => {
                    const target = context.deckSearchSelected[0];
                    return {
                        target,
                        source: this,
                        resetOnCancel: false,
                        playType: PlayType.PlayFromHand,
                        playAction: target
                            ? [
                                new PlayCharacterAsIfFromHandAtHome(target),
                                new PlayDisguisedCharacterAsIfFromHandAtHome(target)
                            ]
                            : undefined,
                        ignoredRequirements: ['phase']
                    };
                }),

                shuffle: true,
                message: '{0} recalls a {1} relative who is {2} {3}',
                messageArgs: (context, cards) => [
                    context.source,
                    this.msgDistance(cards[0]),
                    this.msgArticle(cards[0]),
                    cards[0]
                ]
            }));
    }

    private msgDistance(card: DrawCard): string {
        return card.hasTrait('gaijin') ? 'very distant' : 'distant';
    }

    private msgArticle(card: DrawCard): string {
        if(card.hasTrait('army')) {
            return 'in the';
        }
        return article(card.name);
    }
}
