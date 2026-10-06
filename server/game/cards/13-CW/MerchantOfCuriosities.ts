import type { Cost } from '../../costs/Cost.js';
import DrawCard from '../../DrawCard.js';
import { Location, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { draw } from '../../GameActions/GameActions.js';
import type { Event } from '../../Events/Event.js';
import { honorTransferMessage } from '../honorTransferMessage.js';

function merchantOfCuriositiesCost(): Cost<{ merchantOfCuriositiesCostPaid: boolean; merchantOfCuriositiesCostDiscardedCard: DrawCard }> {
    return {
        canPay() {
            return true;
        },
        resolve(context, result) {
            const opponent = context.player.opponent;
            const honorAvailable = !!opponent && context.game.actions.loseHonor().canAffect(opponent, context) && context.game.actions.gainHonor().canAffect(context.player, context);
            const cardAvailable = !!opponent && context.game.actions.chosenDiscard().canAffect(opponent, context);

            context.costs.merchantOfCuriositiesCostPaid = false;
            if(opponent && honorAvailable && cardAvailable) {
                context.game.promptWithHandlerMenu(opponent, {
                    activePromptTitle: 'Give an honor and discard a card?',
                    source: context.source,
                    options: [
                        {
                            text: 'Yes',
                            handler: () => {
                                context.costs.merchantOfCuriositiesCostPaid = true;
                                context.game.promptForSelect(opponent, {
                                    activePromptTitle: 'Choose a card to discard',
                                    context: context,

                                    location: Location.Hand,
                                    controller: Players.Opponent,
                                    onSelect: (_player, card) => {
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
                            }
                        },
                        { text: 'No', handler: () => context.costs.merchantOfCuriositiesCostPaid = false }
                    ]
                });
            }
        },
        payEvent(context) {
            if(context.costs.merchantOfCuriositiesCostPaid) {
                const events: Event[] = [];

                const discardAction = context.game.actions.discardCard({ target: context.costs.merchantOfCuriositiesCostDiscardedCard });
                events.push(discardAction.getEvent(context.costs.merchantOfCuriositiesCostDiscardedCard, context));

                const honorAction = context.game.actions.takeHonor({ target: context.player.opponent });
                events.push(honorAction.getEvent(context.player.opponent, context));
                context.game.addMessage('{0} chooses to discard a card and give {1} 1 honor', context.player.opponent, context.player);

                return events;
            }

            const action = context.game.actions.handler(); //this is a do-nothing event to allow you to opt out and not scuttle the event
            return action.getEvent(context.player, context);

        },
        promptsPlayer: true
    };
}


class MerchantOfCuriosities extends DrawCard {
    static id = 'merchant-of-curiosities';

    setupCardAbilities() {
        this.action('Discard a card to draw a card')
            .cost(AbilityDsl.costs.discardCard())
            .cost(merchantOfCuriositiesCost())
            .gameAction(draw(context => ({
                target: context.costs.merchantOfCuriositiesCostPaid ? context.game.getPlayers() : context.player
            })))
            // the card is chosen only once the opponent agreed to pay
            .effect('draw a card{2}', context => [
                context.costs.discardCard,
                honorTransferMessage(context, context.costs.merchantOfCuriositiesCostDiscardedCard, (name) => 'discard ' + name + ' and draw a card')
            ]);
    }
}

export default MerchantOfCuriosities;
