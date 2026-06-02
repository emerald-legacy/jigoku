import type { AbilityContext } from '../../AbilityContext.js';
import type BaseCard from '../../BaseCard.js';
import type Player from '../../Player.js';
import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { TargetMode, Location, Players, CardType } from '../../Constants.js';
import { GameModes } from '../../../GameModes.js';

class CardWrapper {
    dynastyCard: BaseCard;
    targetLocation: string | null;
    constructor(card: BaseCard) {
        this.dynastyCard = card;
        this.targetLocation = null;
    }
}

class GovernorsSpy extends DrawCard {
    static id = 'governor-s-spy';

    dynastyCards: CardWrapper[] = [];
    unplacedDynastyCards: BaseCard[] = [];

    setupCardAbilities() {
        this.dynastyCards = [];
        this.unplacedDynastyCards = [];
        this.action({
            title: 'Flip a player\'s dynasty cards facedown and rearrange them',
            condition: (context) => context.source.isParticipating(),
            target: {
                mode: TargetMode.Select,
                targets: true,
                choices: {
                    [this.owner.name]: AbilityDsl.actions.handler({
                        handler: (context: AbilityContext) => this.governorHandler(context, this.owner)
                    }),
                    [(this.owner.opponent && this.owner.opponent.name) || 'NA']: AbilityDsl.actions.handler({
                        handler: (context: AbilityContext) => {
                            if(this.owner.opponent) {
                                this.governorHandler(context, this.owner.opponent);
                            }
                        }
                    })
                }
            },
            effect: 'turn facedown and rearrange all of {1}\'s dynasty cards',
            effectArgs: (context) => (context.select === this.owner.name ? this.owner : this.owner.opponent) as Player
        });
    }

    governorHandler(context: AbilityContext, targetPlayer: Player) {
        this.dynastyCards = targetPlayer
            .getDynastyCardsInProvince(Location.Provinces)
            .map((card: BaseCard) => new CardWrapper(card));
        this.dynastyCards.sort((a: CardWrapper, b: CardWrapper) => a.dynastyCard.name.localeCompare(b.dynastyCard.name));
        this.dynastyCards.forEach((card: CardWrapper) => {
            this.game.applyGameAction(context, { turnFacedown: card.dynastyCard });
        });
        this.dynastyCards = this.dynastyCards.filter((a: CardWrapper) => a.dynastyCard.owner === targetPlayer);

        this.unplacedDynastyCards = this.dynastyCards.map((a: CardWrapper) => a.dynastyCard);
        this.governorSelectPrompt(context, targetPlayer);

        context.game.queueSimpleStep(() => this.governorMoveCards(context, targetPlayer));
    }

    governorSelectPrompt(context: AbilityContext, targetPlayer: Player) {
        let cardHandler = (currentCard: BaseCard) => {
            this.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose a province for ' + currentCard.name,
                context: context,
                location: Location.Provinces,
                controller: targetPlayer === context.player ? Players.Self : Players.Opponent,
                cardCondition: (card: any) =>
                    card.type === CardType.Province &&
                    this.isProvinceValidTarget(targetPlayer, this.dynastyCards, card),
                onSelect: (player: Player, card: BaseCard) => {
                    this.game.addMessage('{0} places a card', player);
                    this.unplacedDynastyCards = this.unplacedDynastyCards.filter((a: BaseCard) => a !== currentCard);
                    let wrapper = this.dynastyCards.find((a: CardWrapper) => a.dynastyCard === currentCard);
                    let location = card.location;
                    if(wrapper) {
                        wrapper.targetLocation = location;
                    }

                    if(this.unplacedDynastyCards.length > 0) {
                        this.game.promptWithHandlerMenu(context.player, {
                            activePromptTitle: 'Select a card to place',
                            context: context,
                            cards: this.unplacedDynastyCards,
                            cardHandler: cardHandler,
                            handlers: [],
                            choices: []
                        });
                    }

                    return true;
                }
            });
        };

        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Select a card to place',
            context: context,
            cards: this.unplacedDynastyCards,
            cardHandler: cardHandler,
            handlers: [],
            choices: []
        });
    }

    governorMoveCards(context: AbilityContext, targetPlayer: Player) {
        this.dynastyCards.forEach((card: CardWrapper) => {
            targetPlayer.moveCard(card.dynastyCard, card.targetLocation as Location);
        });
        let emptyLocations = this.getEmptyProvinces(this.dynastyCards);
        emptyLocations.forEach((location) => {
            context.refillProvince(targetPlayer, location);
        });
        this.game.addMessage('{0} has finished placing cards', context.player);
    }

    isProvinceValidTarget(targetPlayer: Player, cards: CardWrapper[], province: BaseCard) {
        let emptyLocations = this.getEmptyProvinces(cards);

        let location = province.location;
        let cardsLeft = cards.filter((a: CardWrapper) => !a.targetLocation).length;

        if(cardsLeft > emptyLocations.length) {
            return true;
        }

        return emptyLocations.some((loc) => loc === location);
    }

    getEmptyProvinces(cards: CardWrapper[]): Location[] {
        let emptyLocations: Location[] = [];
        let baseLocations = [Location.ProvinceOne, Location.ProvinceTwo, Location.ProvinceThree];
        if(this.game.gameMode !== GameModes.Skirmish) {
            baseLocations.push(Location.ProvinceFour);
        }
        baseLocations.forEach((p) => {
            if(!cards.some((card: CardWrapper) => card.targetLocation === p)) {
                emptyLocations.push(p);
            }
        });

        return emptyLocations;
    }
}


export default GovernorsSpy;
