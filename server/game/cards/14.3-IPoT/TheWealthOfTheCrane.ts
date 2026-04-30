import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';
import { Players, Locations, CardTypes } from '../../Constants';
import { GameModes } from '../../../GameModes';

class TheWealthOfTheCrane extends DrawCard {
    static id = 'the-wealth-of-the-crane';

    setupCardAbilities() {
        this.cards = [];
        this.chosenProvinces = [];
        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: (card, player) => {
                    return player.getNumberOfFaceupProvinces();
                },
                match: (card, source) => card === source
            })
        });

        this.action({
            title: 'Look at your dynasty deck',
            effect: 'look at the top ten cards of their dynasty deck',
            condition: (context) => context.player.dynastyDeck.length > 0,
            max: AbilityDsl.limit.perPhase(1),
            handler: (context) => {
                this.cards = context.player.dynastyDeck.slice(0, 10);
                this.chosenProvinces = [];

                this.wealthSelectPrompt(context);
            }
        });
    }

    wealthSelectPrompt(context) {
        if(!this.cards || this.cards.length <= 0 || !this.hasRemainingTarget()) {
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

    isProvinceValidTarget(province) {
        return province.location !== Locations.StrongholdProvince && !this.chosenProvinces.some((a) => a === province);
    }

    hasRemainingTarget() {
        let baseLocations = [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree];
        if(this.game.gameMode !== GameModes.Skirmish) {
            baseLocations.push(Locations.ProvinceFour);
        }

        return this.chosenProvinces.length < baseLocations.length;
    }
}


export default TheWealthOfTheCrane;
