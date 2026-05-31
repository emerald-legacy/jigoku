import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { CardTypes, Locations, Players } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Player from '../Player.js';
import type Ring from '../Ring.js';

type ControllerProp = Players | ((context: AbilityContext) => Players);

export type NumCardsFunc = (context: AbilityContext) => number;

export interface BaseCardSelectorProperties {
    cardCondition?: (card: any, context: AbilityContext) => boolean;
    cardType?: CardTypes | CardTypes[];
    optional?: boolean;
    location?: Locations | Locations[];
    controller?: ControllerProp;
    targets?: boolean;
    sameDiscardPile?: boolean;
    [key: string]: unknown;
}

class BaseCardSelector {
    cardCondition: (card: BaseCard, context: AbilityContext) => boolean = () => true;
    cardType: CardTypes[];
    optional: boolean;
    location: Locations[];
    controller: ControllerProp;
    checkTarget: boolean;
    sameDiscardPile: boolean;

    constructor(properties: BaseCardSelectorProperties) {
        this.cardCondition = properties.cardCondition ?? (() => true);
        this.cardType = (properties.cardType as CardTypes[]) ?? [];
        this.optional = properties.optional ?? false;
        this.location = this.buildLocation(properties.location);
        this.controller = properties.controller || Players.Any;
        this.checkTarget = !!properties.targets;
        this.sameDiscardPile = !!properties.sameDiscardPile;

        if(!Array.isArray(properties.cardType)) {
            this.cardType = [properties.cardType as CardTypes];
        }
    }

    buildLocation(property?: Locations | Locations[]): Locations[] {
        let location: Locations[] = property
            ? Array.isArray(property)
                ? property
                : [property]
            : [Locations.PlayArea];
        let index = location.indexOf(Locations.Provinces);
        if(index > -1) {
            location.splice(
                index,
                1,
                Locations.ProvinceOne,
                Locations.ProvinceTwo,
                Locations.ProvinceThree,
                Locations.ProvinceFour,
                Locations.StrongholdProvince
            );
        }
        return location;
    }

    findPossibleCards(context: AbilityContext): BaseCard[] {
        let controllerProp = this.controller;
        if(typeof controllerProp === 'function') {
            controllerProp = controllerProp(context);
        }

        if(this.location.includes(Locations.Any)) {
            if(controllerProp === Players.Self) {
                return context.game.allCards.filter((card: BaseCard) => card.controller === context.player);
            } else if(controllerProp === Players.Opponent) {
                return context.game.allCards.filter((card: BaseCard) => card.controller === context.player.opponent);
            }
            return context.game.allCards;
        }
        let attachments: BaseCard[] = context.player.cardsInPlay.reduce((array: BaseCard[], card: DrawCard) => array.concat(card.attachments), [] as BaseCard[]);
        let allProvinceAttachments: BaseCard[] = context.player
            .getProvinces()
            .reduce((array: BaseCard[], card) => array.concat(card.attachments), [] as BaseCard[]);

        if(context.player.opponent) {
            allProvinceAttachments = allProvinceAttachments.concat(
                context.player.opponent.getProvinces().reduce((array: BaseCard[], card) => array.concat(card.attachments), [] as BaseCard[])
            );
        }

        attachments = attachments.concat(allProvinceAttachments);

        if(context.game.rings) {
            let rings = Object.values(context.game.rings) as Ring[];
            let allRingAttachments = rings.map((ring) => ring.attachments).flat();
            attachments = attachments.concat(allRingAttachments);
        }
        if(context.player.opponent) {
            attachments = attachments.concat(...context.player.opponent.cardsInPlay.map((card: DrawCard) => card.attachments));
        }
        let possibleCards: BaseCard[] = [];
        if(controllerProp !== Players.Opponent) {
            possibleCards = this.location.reduce((array: BaseCard[], location: Locations) => {
                let cards = context.player.getSourceList(location).slice();
                if(location === Locations.PlayArea) {
                    return array.concat(
                        cards,
                        attachments.filter((card: BaseCard) => card.controller === context.player)
                    );
                }
                return array.concat(cards);
            }, possibleCards);
        }
        let opponent = context.player.opponent;
        if(controllerProp !== Players.Self && opponent) {
            possibleCards = this.location.reduce((array: BaseCard[], location: Locations) => {
                let cards = opponent.getSourceList(location).slice();
                if(location === Locations.PlayArea) {
                    return array.concat(
                        cards,
                        attachments.filter((card: BaseCard) => card.controller === opponent)
                    );
                }
                return array.concat(cards);
            }, possibleCards);
        }
        return possibleCards;
    }

    canTarget(card: BaseCard, context: AbilityContext, choosingPlayer?: Player, selectedCards: BaseCard[] = []): boolean {
        let controllerProp = this.controller;
        if(typeof controllerProp === 'function') {
            controllerProp = controllerProp(context);
        }

        if(!card) {
            return false;
        }

        if(this.sameDiscardPile && selectedCards.length > 0) {
            return card.location === selectedCards[0].location && card.owner === selectedCards[0].owner;
        }

        if(this.checkTarget && !card.canBeTargeted(context, selectedCards)) {
            return false;
        }
        if(controllerProp === Players.Self && card.controller !== context.player) {
            return false;
        }
        if(controllerProp === Players.Opponent && card.controller !== context.player.opponent) {
            return false;
        }
        if(!this.location.includes(Locations.Any) && !this.location.includes(card.location as Locations)) {
            return false;
        }
        if(card.location === Locations.Hand && card.controller !== choosingPlayer) {
            return false;
        }
        return this.cardType.includes(card.getType()) && this.cardCondition(card, context);
    }

    getAllLegalTargets(context: AbilityContext, choosingPlayer?: Player): BaseCard[] {
        return this.findPossibleCards(context).filter((card: BaseCard) => this.canTarget(card, context, choosingPlayer));
    }

    hasEnoughSelected(selectedCards: BaseCard[], _context?: AbilityContext): boolean {
        return this.optional || selectedCards.length > 0;
    }

    hasEnoughTargets(context: AbilityContext, choosingPlayer: Player): boolean {
        return this.findPossibleCards(context).some((card: BaseCard) => this.canTarget(card, context, choosingPlayer));
    }

    defaultActivePromptTitle(_context?: AbilityContext): string {
        return 'Choose cards';
    }

    automaticFireOnSelect(_context?: AbilityContext): boolean {
        return false;
    }

    wouldExceedLimit(_selectedCards: BaseCard[], _card?: BaseCard): boolean {
        return false;
    }

    hasReachedLimit(_selectedCards: BaseCard[], _context?: AbilityContext): boolean {
        return false;
    }

    hasExceededLimit(_selectedCards: BaseCard[], _context?: AbilityContext): boolean {
        return false;
    }

    formatSelectParam(cards: BaseCard[]): BaseCard | BaseCard[] {
        return cards;
    }
}

export default BaseCardSelector;
