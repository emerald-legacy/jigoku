import { Location } from './Constants.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type { ProvinceCard } from './ProvinceCard.js';

export interface AdditionalPile {
    cards: BaseCard[];
}

/** The piles that only hold conflict and dynasty cards. */
export type DrawCardPile =
    | Location.Hand
    | Location.ConflictDeck
    | Location.DynastyDeck
    | Location.ConflictDiscardPile
    | Location.DynastyDiscardPile
    | Location.PlayArea;

export class PlayerZones {
    dynastyDeck: DrawCard[] = [];
    conflictDeck: DrawCard[] = [];
    provinceDeck: ProvinceCard[] = [];
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

    /** The pile at `source`; a pile unknown so far is empty (custom piles are keyed by the uuid of the card they belong to). */
    getSourceList(source: DrawCardPile): DrawCard[];
    getSourceList(source: Location.ProvinceDeck): ProvinceCard[];
    getSourceList(source: string): BaseCard[];
    getSourceList(source: string): BaseCard[] {
        switch(source) {
            case Location.Hand:
            case Location.ConflictDeck:
            case Location.DynastyDeck:
            case Location.ConflictDiscardPile:
            case Location.DynastyDiscardPile:
            case Location.PlayArea:
                return this.drawCardPile(source);
            case Location.RemovedFromGame:
                return this.removedFromGame;
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
                return [
                    this.provinceOne,
                    this.provinceTwo,
                    this.provinceThree,
                    this.provinceFour,
                    this.strongholdProvince
                ].flat();
            case Location.UnderneathStronghold:
                return this.underneathStronghold;
            default:
                return this.hasAdditionalPile(source) ? this.additionalPiles[source].cards : [];
        }
    }

    private drawCardPile(source: DrawCardPile): DrawCard[] {
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
            case Location.PlayArea:
                return this.cardsInPlay;
        }
    }

    /** Takes the card out of the pile at `source`. */
    removeCard(source: string, uuid: string): void {
        const without = <Card extends BaseCard>(cards: Card[]) => cards.filter((card) => card.uuid !== uuid);
        switch(source) {
            case Location.Hand:
                this.hand = without(this.hand);
                break;
            case Location.ConflictDeck:
                this.conflictDeck = without(this.conflictDeck);
                break;
            case Location.DynastyDeck:
                this.dynastyDeck = without(this.dynastyDeck);
                break;
            case Location.ConflictDiscardPile:
                this.conflictDiscardPile = without(this.conflictDiscardPile);
                break;
            case Location.DynastyDiscardPile:
                this.dynastyDiscardPile = without(this.dynastyDiscardPile);
                break;
            case Location.RemovedFromGame:
                this.removedFromGame = without(this.removedFromGame);
                break;
            case Location.PlayArea:
                this.cardsInPlay = without(this.cardsInPlay);
                break;
            case Location.ProvinceOne:
                this.provinceOne = without(this.provinceOne);
                break;
            case Location.ProvinceTwo:
                this.provinceTwo = without(this.provinceTwo);
                break;
            case Location.ProvinceThree:
                this.provinceThree = without(this.provinceThree);
                break;
            case Location.ProvinceFour:
                this.provinceFour = without(this.provinceFour);
                break;
            case Location.StrongholdProvince:
                this.strongholdProvince = without(this.strongholdProvince);
                break;
            case Location.ProvinceDeck:
                this.provinceDeck = without(this.provinceDeck);
                break;
            case Location.UnderneathStronghold:
                this.underneathStronghold = without(this.underneathStronghold);
                break;
            case Location.Provinces:
                break;
            default:
                if(this.hasAdditionalPile(source)) {
                    this.additionalPiles[source].cards = without(this.additionalPiles[source].cards);
                }
        }
    }

    hasAdditionalPile(name: string): boolean {
        return Object.hasOwn(this.additionalPiles, name);
    }

    createAdditionalPile(name: string, properties?: Record<string, unknown>): AdditionalPile {
        this.additionalPiles[name] = Object.assign({ cards: [] }, properties);
        return this.additionalPiles[name];
    }

    /** The additional pile called `name`, created when there is none yet. */
    ensureAdditionalPile(name: string): AdditionalPile {
        return this.hasAdditionalPile(name) ? this.additionalPiles[name] : this.createAdditionalPile(name);
    }

    getDynastyCardInProvince(location: string): DrawCard | undefined {
        return this.getSourceList(location).find((card) => card.isDynastyCard());
    }

    getDynastyCardsInProvince(location: string): DrawCard[] {
        return this.getSourceList(location).filter((card) => card.isDynastyCard());
    }

    getProvinceCardInProvince(location: string): ProvinceCard | undefined {
        return this.getSourceList(location).find((card) => card.isProvinceCard());
    }
}
