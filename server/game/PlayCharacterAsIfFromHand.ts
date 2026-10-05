import { AbilityContext } from './AbilityContext.js';
import { PlayType } from './Constants.js';
import { PlayCharacterAction, PlayCharacterIntoLocation } from './PlayCharacterAction.js';
import DrawCard from './DrawCard.js';
import Player from './Player.js';

export class PlayCharacterAsIfFromHand extends PlayCharacterAction {
    constructor(card: DrawCard, intoLocation = PlayCharacterIntoLocation.Any) {
        super(card, intoLocation);
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

export class PlayCharacterAsIfFromHandIntoConflict extends PlayCharacterAsIfFromHand {
    constructor(card: DrawCard) {
        super(card, PlayCharacterIntoLocation.Conflict);
    }
}

export class PlayCharacterAsIfFromHandAtHome extends PlayCharacterAsIfFromHand {
    constructor(card: DrawCard) {
        super(card, PlayCharacterIntoLocation.Home);
    }
}

// A card in hand is never facedown, and putIntoPlay refuses a facedown card, so a
// facedown card played this way is turned face up as it is played.
export class PlayFacedownCharacterAsIfFromHand extends PlayCharacterAsIfFromHand {
    public executeHandler(context: AbilityContext<DrawCard>): void {
        context.source.facedown = false;
        super.executeHandler(context);
    }
}
