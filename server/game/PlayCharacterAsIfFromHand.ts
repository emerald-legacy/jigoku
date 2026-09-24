import { AbilityContext } from './AbilityContext.js';
import { PlayType } from './Constants.js';
import { PlayCharacterAction, PlayCharacterIntoLocation } from './PlayCharacterAction.js';
import DrawCard from './DrawCard.js';
import Player from './Player.js';

export class PlayCharacterAsIfFromHand extends PlayCharacterAction {
    constructor(card: DrawCard) {
        super(card);
    }

    // A card in hand is never facedown, and putIntoPlay refuses a facedown card, so a
    // card played out of a province this way is turned face up as it is played.
    public executeHandler(context: AbilityContext<DrawCard> & { chooseFate: number }): void {
        context.source.facedown = false;
        super.executeHandler(context);
    }

    public createContext(player: Player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayType.PlayFromHand;
        return context;
    }

    public meetsRequirements(context: AbilityContext<DrawCard>, ignoredRequirements: string[] = []) {
        const newIgnoredRequirements = ignoredRequirements.includes('location')
            ? ignoredRequirements
            : ignoredRequirements.concat('location');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }
}

export class PlayCharacterAsIfFromHandIntoConflict extends PlayCharacterAction {
    constructor(card: DrawCard) {
        super(card, PlayCharacterIntoLocation.Conflict);
    }

    public createContext(player: Player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayType.PlayFromHand;
        return context;
    }

    public meetsRequirements(context: AbilityContext<DrawCard>, ignoredRequirements: string[] = []) {
        const newIgnoredRequirements = ignoredRequirements.includes('location')
            ? ignoredRequirements
            : ignoredRequirements.concat('location');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }
}

export class PlayCharacterAsIfFromHandAtHome extends PlayCharacterAction {
    constructor(card: DrawCard) {
        super(card, PlayCharacterIntoLocation.Home);
    }

    public createContext(player: Player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayType.PlayFromHand;
        return context;
    }

    public meetsRequirements(context: AbilityContext<DrawCard>, ignoredRequirements: string[] = []) {
        const newIgnoredRequirements = ignoredRequirements.includes('location')
            ? ignoredRequirements
            : ignoredRequirements.concat('location');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }
}
