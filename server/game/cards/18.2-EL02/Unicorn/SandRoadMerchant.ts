import { Location, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
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
            .gameAction(AbilityDsl.actions.sequentialContext((context) => ({
                gameActions: [
                    AbilityDsl.actions.deckSearch({
                        amount: 2,
                        player: context.player.opponent,
                        choosingPlayer: context.player,
                        gameAction: AbilityDsl.actions.placeCardUnderneath({
                            destination: this
                        }),
                        shuffle: false,
                        reveal: true
                    }),
                    AbilityDsl.actions.chooseAction(() => {
                        const topCard = context.player.opponent?.conflictDeck[0];
                        return {
                            activePromptTitle: topCard && 'Choose an action for ' + topCard.name,
                            player: Players.Opponent,
                            options: {
                                'Leave on top of your deck': {
                                    action: AbilityDsl.actions.noAction(),
                                    message: '{0} chooses to put {2} on top of their deck'
                                },
                                'Put on the bottom of your deck': {
                                    action: AbilityDsl.actions.moveCard({ target: topCard ?? [], destination: Location.ConflictDeck, bottom: true }),
                                    message: '{0} chooses to put {2} on the bottom of their deck'
                                }
                            },
                            messageArgs: [topCard]
                        };
                    })
                ]
            })))
            .effect('look at the top two cards of their opponent\'s conflict deck');
    }
}
