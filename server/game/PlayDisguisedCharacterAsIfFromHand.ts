import type { AbilityContext } from './AbilityContext.js';
import { PlayType, type Blocker } from './Constants.js';
import { PlayDisguisedCharacterAction } from './PlayDisguisedCharacterAction.js';
import { PlayIntoLocation } from './PlayCharacterAction.js';
import { asIfFromHandBlockers, type AsIfFromHandOptions } from './PlayCharacterAsIfFromHand.js';
import type DrawCard from './DrawCard.js';
import type Player from './Player.js';

/** Plays a character with Disguised from where it is "as if it were in your hand". */
export class PlayDisguisedCharacterAsIfFromHand extends PlayDisguisedCharacterAction {
    constructor(card: DrawCard, private options: AsIfFromHandOptions = {}) {
        super(card, options.into ?? PlayIntoLocation.Any);
    }

    override createContext(player: Player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayType.PlayFromHand;
        return context;
    }

    override meetsRequirements(context: AbilityContext<DrawCard>, ignoredBlockers: Blocker[] = []) {
        return super.meetsRequirements(context, asIfFromHandBlockers(ignoredBlockers));
    }

    override executeHandler(context: AbilityContext<DrawCard>) {
        if(this.options.facedown) {
            context.source.facedown = false;
        }
        super.executeHandler(context);
    }
}
