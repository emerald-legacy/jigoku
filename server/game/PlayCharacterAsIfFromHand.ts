import { AbilityContext } from './AbilityContext.js';
import { PlayType, Blocker } from './Constants.js';
import { PlayCharacterAction, PlayIntoLocation } from './PlayCharacterAction.js';
import DrawCard from './DrawCard.js';
import Player from './Player.js';

export class PlayCharacterAsIfFromHand extends PlayCharacterAction {
    constructor(card: DrawCard, intoLocation = PlayIntoLocation.Any) {
        super(card, intoLocation);
    }

    public createContext(player: Player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayType.PlayFromHand;
        return context;
    }

    public meetsRequirements(context: AbilityContext<DrawCard>, ignoredBlockers: Blocker[] = []) {
        const newIgnoredBlockers = ignoredBlockers.includes(Blocker.WrongLocation)
            ? ignoredBlockers
            : ignoredBlockers.concat(Blocker.WrongLocation);
        return super.meetsRequirements(context, newIgnoredBlockers);
    }
}

export class PlayCharacterAsIfFromHandIntoConflict extends PlayCharacterAsIfFromHand {
    constructor(card: DrawCard) {
        super(card, PlayIntoLocation.Conflict);
    }
}

export class PlayCharacterAsIfFromHandAtHome extends PlayCharacterAsIfFromHand {
    constructor(card: DrawCard) {
        super(card, PlayIntoLocation.Home);
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
