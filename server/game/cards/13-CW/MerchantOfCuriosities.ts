import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import type BaseCard from '../../BaseCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import { Location, TargetMode, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import type { Event } from '../../Events/Event.js';

const merchantOfCuriositiesCost = function () {
    return {
        canPay: function () {
            return true;
        },
        resolve: function (context: any, result: any) {
            let honorAvailable = true;
            let cardAvailable = true;
            if(!context.player.opponent || !context.game.actions.loseHonor().canAffect(context.player.opponent, context) || !context.game.actions.gainHonor().canAffect(context.player, context)) {
                honorAvailable = false;
            }

            if(!context.player.opponent || !context.game.actions.chosenDiscard().canAffect(context.player.opponent, context)) {
                cardAvailable = false;
            }

            context.costs.merchantOfCuriositiesCostPaid = false;
            if(honorAvailable && cardAvailable) {
                context.game.promptWithHandlerMenu(context.player.opponent, {
                    activePromptTitle: 'Give an honor and discard a card?',
                    source: context.source,
                    choices: ['Yes', 'No'],
                    handlers: [
                        () => {
                            context.costs.merchantOfCuriositiesCostPaid = true;
                            context.game.promptForSelect(context.player.opponent, {
                                activePromptTitle: 'Choose a card to discard',
                                context: context,
                                mode: TargetMode.Single,
                                numCards: 1,
                                location: Location.Hand,
                                controller: Players.Opponent,
                                onSelect: (player: any, card: any) => {
                                    context.costs.merchantOfCuriositiesCostDiscardedCard = card;
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
        payEvent: function (context: AbilityContext) {
            if(context.costs.merchantOfCuriositiesCostPaid) {
                let events: Event[] = [];

                let discardAction = context.game.actions.discardCard({ target: context.costs.merchantOfCuriositiesCostDiscardedCard as DrawCard });
                events.push(discardAction.getEvent(context.costs.merchantOfCuriositiesCostDiscardedCard as DrawCard, context));

                let honorAction = context.game.actions.takeHonor({ target: context.player.opponent as Player });
                events.push(honorAction.getEvent(context.player.opponent as Player, context));
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
        this.action({
            title: 'Discard a card to draw a card',
            cost: [
                AbilityDsl.costs.discardCard(),
                merchantOfCuriositiesCost()
            ],
            gameAction: AbilityDsl.actions.draw(context => ({
                target: context.costs.merchantOfCuriositiesCostPaid ? context.game.getPlayers() : context.player
            })),
            effect: 'draw a card{2}',
            effectArgs: context => [context.costs.discardCard as BaseCard, this.buildString(context)]
        });
    }

    buildString(context: AbilityContext) {
        if(context.costs.merchantOfCuriositiesCostPaid) {
            return '.  ' + (context.player.opponent as Player).name + ' gives ' + context.player.name + ' 1 honor to discard ' +
                (context.costs.merchantOfCuriositiesCostDiscardedCard as DrawCard).name + ' and draw a card';
        }
        return '';
    }
}

export default MerchantOfCuriosities;

