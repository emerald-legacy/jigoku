import { Locations } from './Constants.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type { ProvinceCard } from './ProvinceCard.js';

export class PlayerZones {
    dynastyDeck: DrawCard[] = [];
    conflictDeck: DrawCard[] = [];
    provinceDeck: BaseCard[] = [];
    hand: DrawCard[] = [];
    cardsInPlay: DrawCard[] = [];
    strongholdProvince: BaseCard[] = [];
    provinceOne: BaseCard[] = [];
    provinceTwo: BaseCard[] = [];
    provinceThree: BaseCard[] = [];
    provinceFour: BaseCard[] = [];
    dynastyDiscardPile: DrawCard[] = [];
    conflictDiscardPile: DrawCard[] = [];
    removedFromGame: BaseCard[] = [];
    additionalPiles: Record<string, any> = {};
    underneathStronghold: BaseCard[] = [];

    getSourceList(source: string): any[] {
        switch(source) {
            case Locations.Hand:
                return this.hand;
            case Locations.ConflictDeck:
                return this.conflictDeck;
            case Locations.DynastyDeck:
                return this.dynastyDeck;
            case Locations.ConflictDiscardPile:
                return this.conflictDiscardPile;
            case Locations.DynastyDiscardPile:
                return this.dynastyDiscardPile;
            case Locations.RemovedFromGame:
                return this.removedFromGame;
            case Locations.PlayArea:
                return this.cardsInPlay;
            case Locations.ProvinceOne:
                return this.provinceOne;
            case Locations.ProvinceTwo:
                return this.provinceTwo;
            case Locations.ProvinceThree:
                return this.provinceThree;
            case Locations.ProvinceFour:
                return this.provinceFour;
            case Locations.StrongholdProvince:
                return this.strongholdProvince;
            case Locations.ProvinceDeck:
                return this.provinceDeck;
            case Locations.Provinces:
                return ([] as any[]).concat(
                    this.provinceOne,
                    this.provinceTwo,
                    this.provinceThree,
                    this.provinceFour,
                    this.strongholdProvince
                );
            case Locations.UnderneathStronghold:
                return this.underneathStronghold;
            default:
                if(source) {
                    if(!this.additionalPiles[source]) {
                        this.createAdditionalPile(source);
                    }
                    return this.additionalPiles[source].cards;
                }
                return [];
        }
    }

    updateSourceList(source: string, targetList: any[]): void {
        switch(source) {
            case Locations.Hand:
                this.hand = targetList;
                break;
            case Locations.ConflictDeck:
                this.conflictDeck = targetList;
                break;
            case Locations.DynastyDeck:
                this.dynastyDeck = targetList;
                break;
            case Locations.ConflictDiscardPile:
                this.conflictDiscardPile = targetList;
                break;
            case Locations.DynastyDiscardPile:
                this.dynastyDiscardPile = targetList;
                break;
            case Locations.RemovedFromGame:
                this.removedFromGame = targetList;
                break;
            case Locations.PlayArea:
                this.cardsInPlay = targetList;
                break;
            case Locations.ProvinceOne:
                this.provinceOne = targetList;
                break;
            case Locations.ProvinceTwo:
                this.provinceTwo = targetList;
                break;
            case Locations.ProvinceThree:
                this.provinceThree = targetList;
                break;
            case Locations.ProvinceFour:
                this.provinceFour = targetList;
                break;
            case Locations.StrongholdProvince:
                this.strongholdProvince = targetList;
                break;
            case Locations.ProvinceDeck:
                this.provinceDeck = targetList;
                break;
            case Locations.UnderneathStronghold:
                this.underneathStronghold = targetList;
                break;
            default:
                if(this.additionalPiles[source]) {
                    this.additionalPiles[source].cards = targetList;
                }
        }
    }

    createAdditionalPile(name: string, properties?: any): void {
        this.additionalPiles[name] = Object.assign({ cards: [] }, properties);
    }

    getDynastyCardInProvince(location: string): DrawCard | undefined {
        return this.getSourceList(location).find((card: any) => card.isDynasty);
    }

    getDynastyCardsInProvince(location: string): DrawCard[] {
        let cards = this.getSourceList(location).filter((card: any) => card.isDynasty);
        if(!Array.isArray(cards)) {
            cards = [cards];
        }
        return cards;
    }

    getProvinceCardInProvince(location: string): ProvinceCard | undefined {
        return this.getSourceList(location).find((card: any) => card.isProvince) as ProvinceCard | undefined;
    }
}
