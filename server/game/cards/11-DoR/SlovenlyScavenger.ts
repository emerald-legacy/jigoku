import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { DeckType, Location, Players } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { handler } from '../../GameActions/GameActions.js';
import { DeckChoice } from '../DeckChoice.js';

const discardPiles = new DeckChoice({ players: Players.Any, pile: 'discard pile' });

class SlovenlyScavenger extends DrawCard {
    static id = 'slovenly-scavenger';

    setupCardAbilities() {
        this.reaction('Shuffle a discard pile into a deck')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isParticipating()
            })
            .cost(costs.sacrificeSelf())
            .selectFrom({
                targets: true,
                activePromptTitle: 'Choose which discard pile to shuffle:'
            }, discardPiles.choices((player, deck) => handler({
                handler: () => {
                    const isDynasty = deck === DeckType.Dynasty;
                    for(const card of [...(isDynasty ? player.dynastyDiscardPile : player.conflictDiscardPile)]) {
                        player.moveCard(card, isDynasty ? Location.DynastyDeck : Location.ConflictDeck);
                    }
                    if(isDynasty) {
                        player.shuffleDynastyDeck();
                    } else {
                        player.shuffleConflictDeck();
                    }
                }
            })))
            .chatText((context) => msg`shuffle ${discardPiles.chosenName(context)} into their deck`);
    }
}


export default SlovenlyScavenger;
