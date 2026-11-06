import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { DeckType, Location, Players } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { moveCard } from '../../GameActions/GameActions.js';
import { DeckChoice } from '../DeckChoice.js';

const discardPiles = new DeckChoice({ players: Players.Any, pile: 'discard pile' });

class SlovenlyScavenger extends DrawCard {
    static id = 'slovenly-scavenger';

    override setupCardAbilities() {
        this.reaction('Shuffle a discard pile into a deck')
            .when({
                afterConflict: (event, context) => event.conflict.isOnWinningSide(context.source)
            })
            .cost(costs.sacrificeSelf())
            .selectFrom({
                targets: true,
                activePromptTitle: 'Choose which discard pile to shuffle:'
            }, discardPiles.choices((player, deck) => moveCard(() => ({
                target: [...(deck === DeckType.Dynasty ? player.dynastyDiscardPile : player.conflictDiscardPile)],
                destination: deck === DeckType.Dynasty ? Location.DynastyDeck : Location.ConflictDeck,
                shuffle: true
            }))))
            .chatText((context) => msg`shuffle ${discardPiles.chosenName(context)} into their deck`);
    }
}


export default SlovenlyScavenger;
