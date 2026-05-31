import { CardTypes, EventNames, Locations, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
export default class BreakingIn extends ProvinceCard {
    static id = 'breaking-in';

    setupCardAbilities() {
        this.reaction({
            title: 'Search for a character card',
            when: {
                onCardRevealed: (event: EventPayload<EventNames.OnCardRevealed>, context: TriggeredAbilityContext) => event.card === context.source
            },
            handler: (context: TriggeredAbilityContext) => {
                return this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Select a card:',
                    context: context,
                    cards: context.player.dynastyDeck.slice(0, 8).filter((card: any) => card.type === CardTypes.Character),
                    choices: ['Select nothing'],
                    handlers: [() => this.game.addMessage('{0} selects nothing from their deck', context.player)],
                    cardHandler: (cardFromDeck: any) => {
                        if(cardFromDeck.hasTrait('cavalry')) {
                            return this.game.promptForSelect(context.player, {
                                activePromptTitle: 'Choose a province',
                                context: context,
                                cardType: [CardTypes.Province],
                                location: Locations.Provinces,
                                controller: Players.Self,
                                onSelect: (player: any, card: any) => {
                                    this.game.addMessage(
                                        '{0} places {1} in {2}',
                                        context.player,
                                        cardFromDeck,
                                        card.facedown ? card.location : card
                                    );
                                    player.moveCard(cardFromDeck, card.location);
                                    cardFromDeck.facedown = false;
                                    player.shuffleDynastyDeck();
                                    return true;
                                }
                            });
                        }
                        context.player.moveCard(cardFromDeck, context.source.location);
                        cardFromDeck.facedown = false;
                        this.game.addMessage('{0} places {1} in {2}', context.player, cardFromDeck, context.source);
                        context.player.shuffleDynastyDeck();
                        return true;
                    }
                });
            },
            effect: 'choose a character to place in a province'
        });
    }
}
