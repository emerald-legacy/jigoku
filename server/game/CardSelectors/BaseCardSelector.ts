import { Locations, Players } from '../Constants.js';

interface BaseCardSelectorProperties {
    cardCondition?: (card: any, context: any) => boolean;
    cardType?: any | any[];
    optional?: boolean;
    location?: any | any[];
    controller?: any;
    targets?: boolean;
    sameDiscardPile?: boolean;
    [key: string]: any;
}

class BaseCardSelector {
    cardCondition: (card: any, context: any) => boolean = () => true;
    cardType: any[];
    optional: boolean;
    location: any[];
    controller: any;
    checkTarget: boolean;
    sameDiscardPile: boolean;

    constructor(properties: BaseCardSelectorProperties) {
        this.cardCondition = properties.cardCondition ?? (() => true);
        this.cardType = properties.cardType ?? [];
        this.optional = properties.optional ?? false;
        this.location = this.buildLocation(properties.location);
        this.controller = properties.controller || Players.Any;
        this.checkTarget = !!properties.targets;
        this.sameDiscardPile = !!properties.sameDiscardPile;

        if(!Array.isArray(properties.cardType)) {
            this.cardType = [properties.cardType];
        }
    }

    buildLocation(property: any): any[] {
        let location = property || Locations.PlayArea || [];
        if(!Array.isArray(location)) {
            location = [location];
        }
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

    findPossibleCards(context: any): any[] {
        let controllerProp = this.controller;
        if(typeof controllerProp === 'function') {
            controllerProp = controllerProp(context);
        }

        if(this.location.includes(Locations.Any)) {
            if(controllerProp === Players.Self) {
                return context.game.allCards.filter((card: any) => card.controller === context.player);
            } else if(controllerProp === Players.Opponent) {
                return context.game.allCards.filter((card: any) => card.controller === context.player.opponent);
            }
            return context.game.allCards;
        }
        let attachments = context.player.cardsInPlay.reduce((array: any[], card: any) => array.concat(card.attachments), []);
        let allProvinceAttachments = context.player
            .getProvinces()
            .reduce((array: any[], card: any) => array.concat(card.attachments), []);

        if(context.player.opponent) {
            allProvinceAttachments = allProvinceAttachments.concat(
                context.player.opponent.getProvinces().reduce((array: any[], card: any) => array.concat(card.attachments), [])
            );
        }

        attachments = attachments.concat(allProvinceAttachments);

        if(context.source.game.rings) {
            let rings = Object.values(context.source.game.rings);
            let allRingAttachments = rings.map((ring: any) => ring.attachments).flat();
            attachments = attachments.concat(allRingAttachments);
        }
        if(context.player.opponent) {
            attachments = attachments.concat(...context.player.opponent.cardsInPlay.map((card: any) => card.attachments));
        }
        let possibleCards: any[] = [];
        if(controllerProp !== Players.Opponent) {
            possibleCards = this.location.reduce((array: any[], location: any) => {
                let cards = context.player.getSourceList(location).slice();
                if(location === Locations.PlayArea) {
                    return array.concat(
                        cards,
                        attachments.filter((card: any) => card.controller === context.player)
                    );
                }
                return array.concat(cards);
            }, possibleCards);
        }
        if(controllerProp !== Players.Self && context.player.opponent) {
            possibleCards = this.location.reduce((array: any[], location: any) => {
                let cards = context.player.opponent.getSourceList(location).slice();
                if(location === Locations.PlayArea) {
                    return array.concat(
                        cards,
                        attachments.filter((card: any) => card.controller === context.player.opponent)
                    );
                }
                return array.concat(cards);
            }, possibleCards);
        }
        return possibleCards;
    }

    canTarget(card: any, context: any, choosingPlayer: any, selectedCards: any[] = []): boolean {
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
        if(!this.location.includes(Locations.Any) && !this.location.includes(card.location)) {
            return false;
        }
        if(card.location === Locations.Hand && card.controller !== choosingPlayer) {
            return false;
        }
        return this.cardType.includes(card.getType()) && this.cardCondition(card, context);
    }

    getAllLegalTargets(context: any, choosingPlayer?: any): any[] {
        return this.findPossibleCards(context).filter((card: any) => this.canTarget(card, context, choosingPlayer));
    }

    hasEnoughSelected(selectedCards: any[], _context?: any): boolean {
        return this.optional || selectedCards.length > 0;
    }

    hasEnoughTargets(context: any, choosingPlayer: any): boolean {
        return this.findPossibleCards(context).some((card: any) => this.canTarget(card, context, choosingPlayer));
    }

    defaultActivePromptTitle(_context?: any): string {
        return 'Choose cards';
    }

    automaticFireOnSelect(_context?: any): boolean {
        return false;
    }

    wouldExceedLimit(_selectedCards: any[], _card?: any): boolean {
        return false;
    }

    hasReachedLimit(_selectedCards: any[], _context?: any): boolean {
        return false;
    }

    hasExceededLimit(_selectedCards: any[], _context?: any): boolean {
        return false;
    }

    formatSelectParam(cards: any[]): any {
        return cards;
    }
}

export default BaseCardSelector;
