import { CardType, Location, Players } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

export default class MiokosSong extends StrongholdCard {
    static id = 'mioko-s-song';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) =>
                !!context && card.controller === context.player &&
                card.type === CardType.Character &&
                card.isDishonored &&
                card.isFaction('crane'),
            effect: AbilityDsl.effects.modifyBothSkills(1)
        });

        this.reaction({
            title: 'Sabotage the opponent\'s resources',
            when: {
                onCardPlayed: (event, context) =>
                    context.player.opponent &&
                    event.player === context.player &&
                    event.card.type === CardType.Character
            },
            cost: [
                AbilityDsl.costs.bowSelf(),
                AbilityDsl.costs.dishonor({ cardCondition: (card, context) => card === (context as TriggeredAbilityContext).event.card })
            ],
            target: {
                location: Location.Provinces,
                controller: Players.Opponent,
                cardType: CardType.Province,
                gameAction: AbilityDsl.actions.handler({
                    handler: (context) => {
                        const opponent = context.player.opponent;
                        if(!opponent) {
                            return;
                        }
                        const province = context.target;
                        if(!(province instanceof ProvinceCard)) {
                            return;
                        }
                        const topCards: Array<DrawCard> = opponent.dynastyDeck.slice(0, 2);
                        this.game.promptWithHandlerMenu(context.player, {
                            activePromptTitle: 'Which card do you want to put in the province?',
                            context: context,
                            cards: topCards,
                            choices: [],
                            handlers: [],
                            cardHandler: (selectedCard: DrawCard) => {
                                const cardsFromProvince = province.cardsInSelf();
                                for(const fromProvince of cardsFromProvince) {
                                    opponent.moveCard(fromProvince, 'dynasty discard pile');
                                }
                                opponent.moveCard(selectedCard, province.location);
                                selectedCard.facedown = false;
                                for(const goToBottom of topCards.filter((c) => c !== selectedCard)) {
                                    opponent.moveCard(goToBottom, 'dynasty deck bottom');
                                }

                                context.game.addMessage(
                                    '{0} puts {1} into {2}, discarding {3}',
                                    context.player,
                                    selectedCard,
                                    province.isFacedown() ? province.location : province,
                                    cardsFromProvince
                                );
                            }
                        });
                    }
                })
            }
        });
    }
}
