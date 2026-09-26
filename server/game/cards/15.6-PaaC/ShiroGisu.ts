import { Location } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class ShiroGisu extends StrongholdCard {
    static id = 'shiro-gisu';

    setupCardAbilities() {
        this.action('Draw a card')
            .cost(AbilityDsl.costs.bowSelf())
            .condition((context) => !!(this.getCharactersWithoutFate(context) && context.player.conflictDeck.length > 0))
            .gameAction(AbilityDsl.actions.deckSearch({
                amount: (context) => this.getCharactersWithoutFate(context),
                activePromptTitle: 'Choose a card to put in your hand',
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Location.Hand
                }),
                shuffle: false,
                reveal: false,
                placeOnBottomInRandomOrder: true
            }))
            .effect('look at the top {1} cards of their conflict deck', (context) => this.getCharactersWithoutFate(context));
    }

    getCharactersWithoutFate(context: AbilityContext) {
        return context.player.opponent?.cardsInPlay.filter((card) => card.getFate() === 0).length ?? 0;
    }
}
