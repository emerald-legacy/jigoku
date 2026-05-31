import { GameModes } from '../../../../GameModes.js';
import { CardTypes, Locations, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import type DrawCard from '../../../DrawCard.js';
import type BaseCard from '../../../BaseCard.js';

export default class Landfall extends ProvinceCard {
    static id = 'landfall';

    cards!: DrawCard[];
    chosenProvinces!: BaseCard[];

    setupCardAbilities() {
        this.cards = [];
        this.chosenProvinces = [];

        this.reaction({
            title: 'Look at your dynasty deck',
            when: {
                onCardRevealed: (event, context) =>
                    event.card === context.source && context.player.dynastyDeck.length > 0
            },
            effect: 'look at the top 8 cards of their dynasty deck',
            handler: (context: any) => {
                this.cards = context.player.dynastyDeck.slice(0, 8);
                this.chosenProvinces = [];

                this.wealthSelectPrompt(context);
            }
        });
    }

    wealthSelectPrompt(context: any) {
        if(!this.cards || this.cards.length <= 0 || !this.hasRemainingTarget()) {
            context.player.shuffleDynastyDeck();
            return;
        }

        let cardHandler = (currentCard: any) => {
            this.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose a province for ' + currentCard.name,
                context: context,
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: (card: any, _context?: any) => card.type === CardTypes.Province && this.isProvinceValidTarget(card),
                onSelect: (player: any, card: any) => {
                    this.game.addMessage(
                        '{0} puts {1} into {2}',
                        context.player,
                        currentCard,
                        card.isFacedown() ? 'a facedown province' : card.name
                    );
                    this.chosenProvinces.push(card);
                    context.player.moveCard(currentCard, card.location);
                    currentCard.facedown = false;
                    this.cards = this.cards.filter((a: any) => a !== currentCard);

                    if(this.cards && this.cards.length > 0 && this.hasRemainingTarget()) {
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

    isProvinceValidTarget(province: any) {
        return province.location !== Locations.StrongholdProvince && !this.chosenProvinces.some((a: any) => a === province);
    }

    hasRemainingTarget() {
        let baseLocations = [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree];
        if(this.game.gameMode !== GameModes.Skirmish) {
            baseLocations.push(Locations.ProvinceFour);
        }

        return this.chosenProvinces.length < baseLocations.length;
    }
}
