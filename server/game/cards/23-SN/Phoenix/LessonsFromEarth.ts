import { Trait } from '../../../Constants.js';
import { msg } from '../../../GameChat.js';
import { unlimited } from '../../../AbilityLimit.js';
import { chatMessage, chosenDiscard, draw, multiple } from '../../../GameActions/GameActions.js';
import type { GameAction } from '../../../GameActions/GameAction.js';
import { ProvinceAttachment } from '../../ProvinceAttachment.js';

export default class LessonsFromEarth extends ProvinceAttachment {
    static id = 'lessons-from-earth';

    override setupCardAbilities() {
        this.forcedReaction('Winner draws, loser discards')
            // "after a conflict ends" is step 3.3; a broken province keeps it (no "unbroken" in its text)
            .when({
                onConflictFinished: (event, context) =>
                    !!event.conflict.winner && !!event.conflict.loser &&
                    !!context.source.parentProvince && event.conflict.provincesAtEnd.includes(context.source.parentProvince)
            })
            .gameAction(multiple((context) => {
                const gameActions: GameAction[] = [];

                const winner = context.event.conflict?.winner;
                const loser = context.event.conflict?.loser;
                if(!winner || !loser) {
                    return gameActions;
                }

                gameActions.push(draw({
                    target: winner
                }));

                const hasAffinity = loser.hasAffinity(Trait.Earth, context);
                if(!hasAffinity) {
                    gameActions.push(chosenDiscard({
                        target: loser
                    }));
                } else {
                    gameActions.push(chatMessage(() => msg`${loser}'s affinity to Earth prevents them from discarding a card`));
                }
                return gameActions;
            }))
            .chatText((context) => context.event.conflict?.loser?.hasAffinity(Trait.Earth, context)
                ? msg`cause ${context.event.conflict?.winner} to draw a card`
                : msg`cause ${context.event.conflict?.winner} to draw a card and ${context.event.conflict?.loser} to discard a card`)
            .limit(unlimited());
    }

    protected override unbrokenOnly() {
        return false;
    }
}
