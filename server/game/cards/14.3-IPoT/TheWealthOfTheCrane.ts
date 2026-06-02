import { GameModes } from '../../../GameModes.js';
import AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import { CardType, Location, Players } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import type { ProvinceCard } from '../../ProvinceCard.js';

class TheWealthOfTheCrane extends DrawCard {
    static id = 'the-wealth-of-the-crane';

    cards: DrawCard[] = [];
    chosenProvinces: BaseCard[] = [];

    setupCardAbilities() {
        this.cards = [];
        this.chosenProvinces = [];
        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: (card: BaseCard, player: Player) => {
                    return player.getNumberOfFaceupProvinces();
                },
                match: (card: BaseCard, source: BaseCard) => card === source
            })
        });

        this.action({
            title: 'Look at your dynasty deck',
            effect: 'look at the top ten cards of their dynasty deck',
            condition: (context: AbilityContext) => context.player.dynastyDeck.length > 0,
            max: AbilityDsl.limit.perPhase(1),
            handler: (context: AbilityContext) => {
                this.cards = context.player.dynastyDeck.slice(0, 10);
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

        const cardHandler = (currentCard: DrawCard) => {
            this.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose a province for ' + currentCard.name,
                context: context,
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card: BaseCard) => card.type === CardType.Province && this.isProvinceValidTarget(card),
                onSelect: (player: Player, card: BaseCard) => {
                    this.game.addMessage(
                        '{0} puts {1} into {2}',
                        context.player,
                        currentCard,
                        (card as ProvinceCard).isFacedown() ? 'a facedown province' : card.name
                    );
                    this.chosenProvinces.push(card);
                    context.player.moveCard(currentCard, card.location);
                    currentCard.facedown = false;
                    this.cards = this.cards.filter((a: DrawCard) => a !== currentCard);

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
        return province.location !== Location.StrongholdProvince && !this.chosenProvinces.some((a: BaseCard) => a === province);
    }

    hasRemainingTarget() {
        const baseLocations = [Location.ProvinceOne, Location.ProvinceTwo, Location.ProvinceThree];
        if(this.game.gameMode !== GameModes.Skirmish) {
            baseLocations.push(Location.ProvinceFour);
        }

        return this.chosenProvinces.length < baseLocations.length;
    }
}


export default TheWealthOfTheCrane;
