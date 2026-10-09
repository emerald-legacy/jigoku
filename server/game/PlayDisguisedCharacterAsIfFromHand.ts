import { AbilityContext } from './AbilityContext.js';
import { PlayType, Blocker } from './Constants.js';
import { PlayDisguisedCharacterAction } from './PlayDisguisedCharacterAction.js';
import { PlayIntoLocation } from './PlayCharacterAction.js';
import DrawCard from './DrawCard.js';
import Player from './Player.js';

export class PlayDisguisedCharacterAsIfFromHand extends PlayDisguisedCharacterAction {
    constructor(card: DrawCard, intoLocation = PlayIntoLocation.Any) {
        super(card, intoLocation);
    }

    createContext(player: Player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayType.PlayFromHand;
        return context;
    }

    meetsRequirements(context: AbilityContext<DrawCard>, ignoredBlockers: Blocker[] = []) {
        const newIgnoredBlockers = ignoredBlockers.includes(Blocker.WrongLocation)
            ? ignoredBlockers
            : ignoredBlockers.concat(Blocker.WrongLocation);
        return super.meetsRequirements(context, newIgnoredBlockers);
    }
}

export class PlayDisguisedCharacterAsIfFromHandIntoConflict extends PlayDisguisedCharacterAsIfFromHand {
    constructor(card: DrawCard) {
        super(card, PlayIntoLocation.Conflict);
    }
}

export class PlayDisguisedCharacterAsIfFromHandAtHome extends PlayDisguisedCharacterAsIfFromHand {
    constructor(card: DrawCard) {
        super(card, PlayIntoLocation.Home);
    }
}

// Like PlayFacedownCharacterAsIfFromHand: putIntoPlay refuses a facedown card.
export class PlayFacedownDisguisedCharacterAsIfFromHand extends PlayDisguisedCharacterAsIfFromHand {
    executeHandler(context: AbilityContext<DrawCard>) {
        context.source.facedown = false;
        super.executeHandler(context);
    }
}
