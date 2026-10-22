import type { AbilityContext } from './AbilityContext.js';
import { PlayType, Blocker } from './Constants.js';
import { PlayCharacterAction, PlayIntoLocation } from './PlayCharacterAction.js';
import type DrawCard from './DrawCard.js';
import type Player from './Player.js';

export interface AsIfFromHandOptions {
    /** Where the character may be played; anywhere by default. */
    into?: PlayIntoLocation;
    /**
     * For a facedown card: a card in hand is never facedown, and putIntoPlay refuses a facedown card,
     * so it is turned face up as it is played.
     */
    facedown?: boolean;
}

/** The blockers of a play "as if from your hand": the card isn't in hand, so its location doesn't matter. */
export function asIfFromHandBlockers(ignoredBlockers: Blocker[]): Blocker[] {
    return ignoredBlockers.includes(Blocker.WrongLocation) ? ignoredBlockers : ignoredBlockers.concat(Blocker.WrongLocation);
}

/** Plays a character from where it is "as if it were in your hand". */
export class PlayCharacterAsIfFromHand extends PlayCharacterAction {
    constructor(card: DrawCard, private options: AsIfFromHandOptions = {}) {
        super(card, options.into ?? PlayIntoLocation.Any);
    }

    public override createContext(player: Player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayType.PlayFromHand;
        return context;
    }

    public override meetsRequirements(context: AbilityContext<DrawCard>, ignoredBlockers: Blocker[] = []) {
        return super.meetsRequirements(context, asIfFromHandBlockers(ignoredBlockers));
    }

    public override executeHandler(context: AbilityContext<DrawCard>): void {
        if(this.options.facedown) {
            context.source.facedown = false;
        }
        super.executeHandler(context);
    }
}
