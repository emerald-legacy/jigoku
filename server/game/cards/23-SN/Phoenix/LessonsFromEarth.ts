import { msg } from '../../../GameChat.js';
import { unlimited } from '../../../AbilityLimit.js';
import { chatMessage, chosenDiscard, draw, multiple } from '../../../GameActions/GameActions.js';
import { GameAction } from '../../../GameActions/GameAction.js';
import { ProvinceAttachment } from '../../ProvinceAttachment.js';

export default class LessonsFromEarth extends ProvinceAttachment {
    static id = 'lessons-from-earth';

    setupCardAbilities() {
        this.forcedReaction('Winner draws, loser discards')
            .when({
                afterConflict: (event, context) => {
                    return event.conflict.winner && event.conflict.loser && context.source.parentProvince?.isConflictProvince();
                }
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

                const hasAffinity = loser.hasAffinity('earth', context);
                if(!hasAffinity) {
                    gameActions.push(chosenDiscard({
                        target: loser
                    }));
                } else {
                    gameActions.push(chatMessage(() => msg`${loser}'s affinity to Earth prevents them from discarding a card`));
                }
                return gameActions;
            }))
            .chatText((context) => msg`cause ${context.event.conflict?.winner} to draw a card and ${context.event.conflict?.loser} to discard a card`)
            .limit(unlimited());
    }
}
