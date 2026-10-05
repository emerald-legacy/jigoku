import { AbilityContext } from './AbilityContext.js';
import { PlayType } from './Constants.js';
import { PlayDisguisedCharacterAction, PlayDisguisedCharacterIntoLocation } from './PlayDisguisedCharacterAction.js';
import DrawCard from './DrawCard.js';
import Player from './Player.js';

export class PlayDisguisedCharacterAsIfFromHand extends PlayDisguisedCharacterAction {
    constructor(card: DrawCard, intoLocation = PlayDisguisedCharacterIntoLocation.Any) {
        super(card, intoLocation);
    }

    createContext(player: Player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayType.PlayFromHand;
        return context;
    }

    meetsRequirements(context: AbilityContext<DrawCard>, ignoredRequirements: string[] = []) {
        const newIgnoredRequirements = ignoredRequirements.includes('location')
            ? ignoredRequirements
            : ignoredRequirements.concat('location');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }
}

export class PlayDisguisedCharacterAsIfFromHandIntoConflict extends PlayDisguisedCharacterAsIfFromHand {
    constructor(card: DrawCard) {
        super(card, PlayDisguisedCharacterIntoLocation.Conflict);
    }
}

export class PlayDisguisedCharacterAsIfFromHandAtHome extends PlayDisguisedCharacterAsIfFromHand {
    constructor(card: DrawCard) {
        super(card, PlayDisguisedCharacterIntoLocation.Home);
    }
}

// Like PlayFacedownCharacterAsIfFromHand: putIntoPlay refuses a facedown card.
export class PlayFacedownDisguisedCharacterAsIfFromHand extends PlayDisguisedCharacterAsIfFromHand {
    executeHandler(context: AbilityContext<DrawCard>) {
        context.source.facedown = false;
        super.executeHandler(context);
    }
}
