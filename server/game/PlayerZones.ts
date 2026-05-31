import { Locations } from './Constants.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type { ProvinceCard } from './ProvinceCard.js';

export interface AdditionalPile {
    cards: BaseCard[];
    [key: string]: unknown;
}

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
    additionalPiles: Record<string, AdditionalPile> = {};
    underneathStronghold: BaseCard[] = [];

    getSourceList(source: string): BaseCard[] {
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
                return ([] as BaseCard[]).concat(
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

    updateSourceList(source: string, targetList: BaseCard[]): void {
        switch(source) {
            case Locations.Hand:
                this.hand = targetList as DrawCard[];
                break;
            case Locations.ConflictDeck:
                this.conflictDeck = targetList as DrawCard[];
                break;
            case Locations.DynastyDeck:
                this.dynastyDeck = targetList as DrawCard[];
                break;
            case Locations.ConflictDiscardPile:
                this.conflictDiscardPile = targetList as DrawCard[];
                break;
            case Locations.DynastyDiscardPile:
                this.dynastyDiscardPile = targetList as DrawCard[];
                break;
            case Locations.RemovedFromGame:
                this.removedFromGame = targetList;
                break;
            case Locations.PlayArea:
                this.cardsInPlay = targetList as DrawCard[];
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

    createAdditionalPile(name: string, properties?: Record<string, unknown>): void {
        this.additionalPiles[name] = Object.assign({ cards: [] }, properties);
    }

    getDynastyCardInProvince(location: string): DrawCard | undefined {
        return this.getSourceList(location).find((card: BaseCard) => card.isDynasty) as DrawCard | undefined;
    }

    getDynastyCardsInProvince(location: string): DrawCard[] {
        return this.getSourceList(location).filter((card: BaseCard) => card.isDynasty) as DrawCard[];
    }

    getProvinceCardInProvince(location: string): ProvinceCard | undefined {
        return this.getSourceList(location).find((card: BaseCard) => card.isProvince) as ProvinceCard | undefined;
    }
}
