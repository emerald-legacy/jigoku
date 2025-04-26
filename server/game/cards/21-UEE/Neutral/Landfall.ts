import { GameModes } from '../../../../GameModes';
import { CardTypes, Locations, Players } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class Landfall extends DrawCard {
    static id = 'landfall';

    setupCardAbilities() {
        this.cards = [];
        this.chosenProvinces = [];

        this.reaction({
            title: 'Look at your dynasty deck',
            when: {
                onCardRevealed: (event, context) =>
                    event.card === context.source && context.player.dynastyDeck.size() > 0
            },
            effect: 'look at the top 8 cards of their dynasty deck',
            handler: (context) => {
                this.cards = context.player.dynastyDeck.first(8);
                this.chosenProvinces = [];

                this.wealthSelectPrompt(context);
            }
        });
    }

    wealthSelectPrompt(context) {
        if (!this.cards || this.cards.length <= 0 || !this.hasRemainingTarget()) {
            context.player.shuffleDynastyDeck();
            return;
        }

        let cardHandler = (currentCard) => {
            this.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose a province for ' + currentCard.name,
                context: context,
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: (card) => card.type === CardTypes.Province && this.isProvinceValidTarget(card),
                onSelect: (player, card) => {
                    this.game.addMessage(
                        '{0} puts {1} into {2}',
                        context.player,
                        currentCard,
                        card.isFacedown() ? 'a facedown province' : card.name
                    );
                    this.chosenProvinces.push(card);
                    context.player.moveCard(currentCard, card.location);
                    currentCard.facedown = false;
                    this.cards = this.cards.filter((a) => a !== currentCard);

                    if (this.cards && this.cards.length > 0 && this.hasRemainingTarget()) {
                        this.game.promptWithHandlerMenu(context.player, {
                            activePromptTitle: 'Select a card to place in a province',
                            context: context,
                            cards: this.cards,
                            cardHandler: cardHandler,
                            handlers: [],
                            choices: []
                        });
                    } else {
                        context.player.shuffleDynastyDeck();
                    }

                    return true;
                }
            });
        };

        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Select a card to place in a province',
            context: context,
            cards: this.cards,
            cardHandler: cardHandler,
            handlers: [],
            choices: []
        });
    }

    isProvinceValidTarget(province) {
        return province.location !== Locations.StrongholdProvince && !this.chosenProvinces.some((a) => a === province);
    }

    hasRemainingTarget() {
        let baseLocations = [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree];
        if (this.game.gameMode !== GameModes.Skirmish) {
            baseLocations.push(Locations.ProvinceFour);
        }

        return this.chosenProvinces.length < baseLocations.length;
    }
}
