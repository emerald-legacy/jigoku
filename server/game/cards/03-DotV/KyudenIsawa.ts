import { msg } from '../../GameChat.js';
import { CardType, Location, PlayType, Players } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { playCard } from '../../GameActions/GameActions.js';

export default class KyudenIsawa extends StrongholdCard {
    static id = 'kyuden-isawa';

    setupCardAbilities() {
        this.action('Play a spell event from discard')
            .cost(costs.bowSelf())
            .cost(costs.discardCard({
                cardCondition: (card) => card.hasTrait('spell') && card.type === CardType.Event
            }))
            .condition(() => this.game.isDuringConflict())
            .selectCard((context) => ({
                activePromptTitle: 'Choose a spell event',
                cardType: CardType.Event,
                controller: Players.Self,
                location: Location.ConflictDiscardPile,
                cardCondition: (card) => card.hasTrait('spell'),
                gameAction: playCard({
                    resetOnCancel: true,
                    source: this,
                    playType: PlayType.PlayFromHand,
                    postHandler: (spellContext) => {
                        const card = spellContext.source;
                        context.game.addMessage(msg`${card} is removed from the game by ${context.source}'s ability`);
                        context.player.moveCard(card, Location.RemovedFromGame);
                    }
                })
            }))
            .chatText('play a spell event from discard');
    }
}
