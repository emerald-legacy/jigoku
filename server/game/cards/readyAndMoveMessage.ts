import type { AbilityContext } from '../AbilityContext.js';
import type DrawCard from '../DrawCard.js';
import { moveToConflict, ready } from '../GameActions/GameActions.js';
import { msg, type MessageArgs } from '../GameChat.js';

/** "ready X and move it into the conflict", naming only the parts that can happen to the character. */
export function readyAndMoveMessage(context: AbilityContext, character: DrawCard): MessageArgs {
    const readies = ready().canAffect(character, context);
    const moves = moveToConflict().canAffect(character, context);
    if(readies && moves) {
        return msg`ready ${character} and move it into the conflict`;
    }
    return readies ? msg`ready ${character}` : msg`move ${character} into the conflict`;
}
