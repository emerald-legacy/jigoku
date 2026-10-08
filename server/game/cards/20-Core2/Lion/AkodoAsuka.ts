import type { AbilityContext } from '../../../AbilityContext.js';
import { moveCard } from '../../../GameActions/GameActions.js';
import { Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

function charactersOnYourSide(context: AbilityContext) {
    return context.game.currentConflict?.getNumberOfParticipantsFor(context.player) ?? 0;
}

export default class AkodoAsuka extends DrawCard {
    static id = 'akodo-asuka';

    setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating() &&
                    context.player.conflictDeck.length > 0
            })
            .deckSearch({
                cardsToLookAt: (context) => charactersOnYourSide(context),
                activePromptTitle: 'Choose a card to put in your hand',
                gameAction: moveCard({
                    destination: Location.Hand
                }),
                shuffle: true,
                reveal: false
            })
            .effect('look at the top {1} cards of their conflict deck', (context) => charactersOnYourSide(context));
    }
}
