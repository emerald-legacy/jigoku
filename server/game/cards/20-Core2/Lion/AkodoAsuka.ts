import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { moveCard } from '../../../GameActions/GameActions.js';
import { Location, TargetMode } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

function charactersOnYourSide(context: AbilityContext) {
    return context.game.currentConflict?.getNumberOfParticipantsFor(context.player) ?? 0;
}

export default class AkodoAsuka extends DrawCard {
    static id = 'akodo-asuka';

    override setupCardAbilities() {
        this.reaction('Draw a card')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.isOnWinningSide(context.source) &&
                    context.player.conflictDeck.length > 0
            })
            .deckSearch({
                cardsToLookAt: (context) => charactersOnYourSide(context),
                mode: TargetMode.Exactly,
                numCards: 1,
                activePromptTitle: 'Choose a card to put in your hand',
                gameAction: moveCard({
                    destination: Location.Hand
                }),
                reveal: false
            })
            .chatText((context) => {
                const amount = charactersOnYourSide(context);
                return msg`look at the top ${amount} card${amount === 1 ? '' : 's'} of their conflict deck`;
            });
    }
}
