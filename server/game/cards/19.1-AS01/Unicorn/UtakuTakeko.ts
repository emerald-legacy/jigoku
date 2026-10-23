import { msg } from '../../../GameChat.js';
import { CardType, DeckType, PlayType, Blocker, Trait } from '../../../Constants.js';
import { PlayIntoLocation } from '../../../PlayCharacterAction.js';
import { asIfFromHandPlayActions } from '../../../PlayDisguisedCharacterAsIfFromHand.js';
import { playCard } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { article } from '../../article.js';

export default class UtakuTakeko extends DrawCard {
    static id = 'utaku-takeko';

    public override setupCardAbilities() {
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
                        playAction: target ? asIfFromHandPlayActions(target, { into: PlayIntoLocation.Home }) : undefined,
                        ignoredBlockers: [Blocker.WrongPhase]
                    };
                }),
                message: (context, cards) => msg`${context.source} recalls a ${this.msgDistance(cards[0])} relative who is ${this.msgArticle(cards[0])} ${cards[0]}`
            }));
    }

    private msgDistance(card: DrawCard): string {
        return card.hasTrait(Trait.Gaijin) ? 'very distant' : 'distant';
    }

    private msgArticle(card: DrawCard): string {
        if(card.hasTrait(Trait.Army)) {
            return 'in the';
        }
        return article(card.name);
    }
}
