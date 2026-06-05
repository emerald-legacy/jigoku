import { GameModes } from '../../../../GameModes.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Location, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import type DrawCard from '../../../DrawCard.js';
import type BaseCard from '../../../BaseCard.js';
import type Player from '../../../Player.js';

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
            handler: (context: AbilityContext) => {
                this.cards = context.player.dynastyDeck.slice(0, 8);
                this.chosenProvinces = [];

                this.wealthSelectPrompt(context);
            }
        });
    }

    wealthSelectPrompt(context: AbilityContext) {
        if(!this.cards || this.cards.length <= 0 || !this.hasRemainingTarget()) {
            context.player.shuffleDynastyDeck();
            return;
        }

        let cardHandler = (currentCard: DrawCard) => {
            this.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose a province for ' + currentCard.name,
                context: context,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card: BaseCard, _context?: AbilityContext) => card.type === CardType.Province && this.isProvinceValidTarget(card),
                onSelect: (_player: Player, card: BaseCard) => {
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

    isProvinceValidTarget(province: BaseCard) {
        return province.location !== Location.StrongholdProvince && !this.chosenProvinces.some((a) => a === province);
    }

    hasRemainingTarget() {
        let baseLocations = [Location.ProvinceOne, Location.ProvinceTwo, Location.ProvinceThree];
        if(this.game.gameMode !== GameModes.Skirmish) {
            baseLocations.push(Location.ProvinceFour);
        }

        return this.chosenProvinces.length < baseLocations.length;
    }
}
