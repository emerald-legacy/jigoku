import { msg } from '../../../GameChat.js';
import { CardType, Location, Players } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import * as costs from '../../../costs/index.js';
import { modifyBothSkills } from '../../../effects.js';
import { handler } from '../../../GameActions/GameActions.js';

export default class MiokosSong extends StrongholdCard {
    static id = 'mioko-s-song';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) =>
                !!context && card.controller === context.player &&
                card.type === CardType.Character &&
                card.isDishonored &&
                card.isFaction('crane'),
            effect: modifyBothSkills(1)
        });

        this.reaction('Sabotage the opponent\'s resources')
            .when({
                onCardPlayed: (event, context) =>
                    context.player.opponent &&
                    event.player === context.player &&
                    event.card.type === CardType.Character
            })
            .cost(costs.bowSelf())
            .cost(costs.dishonor({ cardCondition: (card, context) => card === context.event.card }))
            .target({
                location: Location.Provinces,
                controller: Players.Opponent,
                cardType: CardType.Province
            }, handler({
                handler: (context) => {
                    const opponent = context.player.opponent;
                    if(!opponent) {
                        return;
                    }
                    const province = context.target;
                    const topCards = opponent.dynastyDeck.slice(0, 2);
                    this.game.promptWithHandlerMenu(context.player, {
                        activePromptTitle: 'Which card do you want to put in the province?',
                        context: context,
                        cards: topCards,
                        cardHandler: (selectedCard) => {
                            const cardsFromProvince = province.cardsInSelf();
                            for(const fromProvince of cardsFromProvince) {
                                opponent.moveCard(fromProvince, Location.DynastyDiscardPile);
                            }
                            opponent.moveCard(selectedCard, province.location);
                            selectedCard.facedown = false;
                            for(const goToBottom of topCards.filter((c) => c !== selectedCard)) {
                                opponent.moveCard(goToBottom, Location.DynastyDeck, { bottom: true });
                            }

                            context.game.addMessage(msg`${context.player} puts ${selectedCard} into ${province.isFacedown() ? province.location : province}, discarding ${cardsFromProvince}`);
                        }
                    });
                }
            }));
    }
}
