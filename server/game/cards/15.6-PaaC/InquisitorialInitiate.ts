import { Location, Players, TargetMode } from '../../Constants.js';
import { cardMenu, discardCard, lookAt, multiple } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { msg } from '../../GameChat.js';

export default class InquisitorialInitiate extends DrawCard {
    static id = 'inquisitorial-initiate';

    public setupCardAbilities() {
        this.reaction('Discard an opponent\'s card')
            .when({
                afterConflict: (event, context) =>
                    context.source.isParticipating() &&
                    event.conflict.winner === context.source.controller &&
                    context.player.opponent !== undefined
            })
            .targetCards({
                activePromptTitle: 'Choose cards to reveal',
                player: Players.Opponent,
                numCardsFunc: (context) =>
                    context.player.opponent?.cardsInPlay.filter((card) => card.getFate() === 0).length ?? 0,
                mode: TargetMode.ExactlyVariable,
                location: Location.Hand
            })
            .gameAction(multiple([
                lookAt((context) => ({
                    target: context.targets.target
                })),
                cardMenu((context) => ({
                    cards: context.targets.target.filter((card) => card.isDrawCard()),
                    gameAction: discardCard(),
                    message: (_context, card, player) => msg`${player} chooses ${card} to be discarded`
                }))
            ]))
            .chatText((context) => {
                const count = context.targets.target.length;
                return msg`make ${context.player.opponent} reveal ${count} card${count === 1 ? '' : 's'} and discard ${count === 1 ? 'it' : 'one of them'}`;
            });
    }
}
