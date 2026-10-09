import { msg } from '../../GameChat.js';
import { Location, RemainingCards } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { moveCard } from '../../GameActions/GameActions.js';

export default class ShiroGisu extends StrongholdCard {
    static id = 'shiro-gisu';

    setupCardAbilities() {
        this.action('Draw a card')
            .cost(costs.bowSelf())
            .condition((context) => !!(this.getCharactersWithoutFate(context) && context.player.conflictDeck.length > 0))
            .deckSearch({
                cardsToLookAt: (context) => this.getCharactersWithoutFate(context),
                activePromptTitle: 'Choose a card to put in your hand',
                gameAction: moveCard({
                    destination: Location.Hand
                }),
                remainingCards: RemainingCards.BottomRandom,
                reveal: false
            })
            .chatText((context) => msg`look at the top ${this.getCharactersWithoutFate(context)} cards of their conflict deck`);
    }

    private getCharactersWithoutFate(context: AbilityContext) {
        return context.player.opponent?.cardsInPlay.filter((card) => card.getFate() === 0).length ?? 0;
    }
}
