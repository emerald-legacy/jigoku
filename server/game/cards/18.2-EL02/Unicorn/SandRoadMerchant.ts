import { msg } from '../../../GameChat.js';
import { Location, Players } from '../../../Constants.js';
import {
    chooseAction,
    deckSearch,
    moveCard,
    noAction,
    placeCardUnderneath,
    sequentialContext
} from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { playableFromUnderneath } from '../../cardsUnderneath.js';

export default class SandRoadMerchant extends DrawCard {
    static id = 'sand-road-merchant';

    public setupCardAbilities() {
        this.persistentEffect(playableFromUnderneath(this));

        this.reaction('Look at your opponent\'s conflict deck')
            .when({
                onConflictDeclared: (event, context) =>
                    (event.attackers ?? []).includes(context.source) && context.player.opponent !== undefined,
                onDefendersDeclared: (event, context) =>
                    event.defenders.includes(context.source) && context.player.opponent !== undefined
            })
            .gameAction(sequentialContext((context) => ({
                gameActions: [
                    deckSearch({
                        cardsToLookAt: 2,
                        player: context.player.opponent,
                        choosingPlayer: context.player,
                        gameAction: placeCardUnderneath({
                            destination: this
                        }),
                        shuffle: false,
                        reveal: true
                    }),
                    chooseAction(() => {
                        const topCard = context.player.opponent?.conflictDeck[0];
                        return {
                            activePromptTitle: topCard && 'Choose an action for ' + topCard.name,
                            player: Players.Opponent,
                            choices: {
                                'Leave on top of your deck': {
                                    action: noAction(),
                                    message: (_context, _target, player) => msg`${player} chooses to put ${topCard} on top of their deck`
                                },
                                'Put on the bottom of your deck': {
                                    action: moveCard({ target: topCard ?? [], destination: Location.ConflictDeck, bottom: true }),
                                    message: (_context, _target, player) => msg`${player} chooses to put ${topCard} on the bottom of their deck`
                                }
                            }
                        };
                    })
                ]
            })))
            .chatText('look at the top two cards of their opponent\'s conflict deck');
    }
}
