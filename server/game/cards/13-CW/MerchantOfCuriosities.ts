import type { Cost } from '../../costs/Cost.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import type BaseCard from '../../BaseCard.js';
import type { Result } from '../../costs/Cost.js';
import { Location, TargetMode, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import type { Event } from '../../Events/Event.js';

const merchantOfCuriositiesCost = function (): Cost<{ merchantOfCuriositiesCostPaid: boolean; merchantOfCuriositiesCostDiscardedCard: DrawCard }> {
    return {
        canPay: function () {
            return true;
        },
        resolve: function (context, result: Result) {
            const opponent = context.player.opponent;
            let honorAvailable = true;
            let cardAvailable = true;
            if(!opponent || !context.game.actions.loseHonor().canAffect(opponent, context) || !context.game.actions.gainHonor().canAffect(context.player, context)) {
                honorAvailable = false;
            }

            if(!opponent || !context.game.actions.chosenDiscard().canAffect(opponent, context)) {
                cardAvailable = false;
            }

            context.costs.merchantOfCuriositiesCostPaid = false;
            if(opponent && honorAvailable && cardAvailable) {
                context.game.promptWithHandlerMenu(opponent, {
                    activePromptTitle: 'Give an honor and discard a card?',
                    source: context.source,
                    choices: ['Yes', 'No'],
                    handlers: [
                        () => {
                            context.costs.merchantOfCuriositiesCostPaid = true;
                            context.game.promptForSelect(opponent, {
                                activePromptTitle: 'Choose a card to discard',
                                context: context,
                                mode: TargetMode.Single,
                                numCards: 1,
                                location: Location.Hand,
                                controller: Players.Opponent,
                                onSelect: (_player: Player, card: BaseCard) => {
                                    if(card.isDrawCard()) {
                                        context.costs.merchantOfCuriositiesCostDiscardedCard = card;
                                    }
                                    return true;
                                },
                                onCancel: () => {
                                    result.cancelled = true;
                                    return true;
                                }
                            });
                        },
                        () => context.costs.merchantOfCuriositiesCostPaid = false
                    ]
                });
            }
        },
        payEvent: function (context) {
            if(context.costs.merchantOfCuriositiesCostPaid) {
                let events: Event[] = [];

                let discardAction = context.game.actions.discardCard({ target: context.costs.merchantOfCuriositiesCostDiscardedCard });
                events.push(discardAction.getEvent(context.costs.merchantOfCuriositiesCostDiscardedCard, context));

                let honorAction = context.game.actions.takeHonor({ target: context.player.opponent });
                events.push(honorAction.getEvent(context.player.opponent, context));
                context.game.addMessage('{0} chooses to discard a card and give {1} 1 honor', context.player.opponent, context.player);

                return events;
            }

            let action = context.game.actions.handler(); //this is a do-nothing event to allow you to opt out and not scuttle the event
            return action.getEvent(context.player, context);

        },
        promptsPlayer: true
    };
};


class MerchantOfCuriosities extends DrawCard {
    static id = 'merchant-of-curiosities';

    setupCardAbilities() {
        this.action('Discard a card to draw a card')
            .cost(AbilityDsl.costs.discardCard())
            .cost(merchantOfCuriositiesCost())
            .gameAction(AbilityDsl.actions.draw(context => ({
                target: context.costs.merchantOfCuriositiesCostPaid ? context.game.getPlayers() : context.player
            })))
            .effect('draw a card{2}', context => [context.costs.discardCard, this.buildString(context.player, context.costs.merchantOfCuriositiesCostDiscardedCard)]);
    }

    // the card is chosen only once the opponent agreed to pay
    buildString(player: Player, discardedCard: DrawCard | undefined) {
        if(player.opponent && discardedCard) {
            return '.  ' + player.opponent.name + ' gives ' + player.name + ' 1 honor to discard ' +
                discardedCard.name + ' and draw a card';
        }
        return '';
    }
}

export default MerchantOfCuriosities;

