import { Location } from './Constants.js';
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
            case Location.Hand:
                return this.hand;
            case Location.ConflictDeck:
                return this.conflictDeck;
            case Location.DynastyDeck:
                return this.dynastyDeck;
            case Location.ConflictDiscardPile:
                return this.conflictDiscardPile;
            case Location.DynastyDiscardPile:
                return this.dynastyDiscardPile;
            case Location.RemovedFromGame:
                return this.removedFromGame;
            case Location.PlayArea:
                return this.cardsInPlay;
            case Location.ProvinceOne:
                return this.provinceOne;
            case Location.ProvinceTwo:
                return this.provinceTwo;
            case Location.ProvinceThree:
                return this.provinceThree;
            case Location.ProvinceFour:
                return this.provinceFour;
            case Location.StrongholdProvince:
                return this.strongholdProvince;
            case Location.ProvinceDeck:
                return this.provinceDeck;
            case Location.Provinces:
                return ([] as BaseCard[]).concat(
                    this.provinceOne,
                    this.provinceTwo,
                    this.provinceThree,
                    this.provinceFour,
                    this.strongholdProvince
                );
            case Location.UnderneathStronghold:
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
            case Location.Hand:
                this.hand = targetList as DrawCard[];
                break;
            case Location.ConflictDeck:
                this.conflictDeck = targetList as DrawCard[];
                break;
            case Location.DynastyDeck:
                this.dynastyDeck = targetList as DrawCard[];
                break;
            case Location.ConflictDiscardPile:
                this.conflictDiscardPile = targetList as DrawCard[];
                break;
            case Location.DynastyDiscardPile:
                this.dynastyDiscardPile = targetList as DrawCard[];
                break;
            case Location.RemovedFromGame:
                this.removedFromGame = targetList;
                break;
            case Location.PlayArea:
                this.cardsInPlay = targetList as DrawCard[];
                break;
            case Location.ProvinceOne:
                this.provinceOne = targetList;
                break;
            case Location.ProvinceTwo:
                this.provinceTwo = targetList;
                break;
            case Location.ProvinceThree:
                this.provinceThree = targetList;
                break;
            case Location.ProvinceFour:
                this.provinceFour = targetList;
                break;
            case Location.StrongholdProvince:
                this.strongholdProvince = targetList;
                break;
            case Location.ProvinceDeck:
                this.provinceDeck = targetList;
                break;
            case Location.UnderneathStronghold:
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
