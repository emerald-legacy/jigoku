import { msg } from '../../../GameChat.js';
import { unlimitedPerConflict } from '../../../AbilityLimit.js';
import { chosenDiscard, draw, handler, multipleContext } from '../../../GameActions/GameActions.js';
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
            .gameAction(multipleContext((context) => {
                const gameActions: GameAction[] = [];

                const winner = context.event.conflict?.winner;
                const loser = context.event.conflict?.loser;
                if(!winner || !loser) {
                    return { gameActions };
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
                    gameActions.push(handler({
                        handler: () => {
                            context.game.addMessage(msg`${loser}'s affinity to Earth prevents them from discarding a card`);
                        }
                    }));
                }
                return { gameActions };
            }))
            .chatText('cause {1} to draw a card and {2} to discard a card', (context) => [context.event.conflict?.winner, context.event.conflict?.loser])
            .limit(unlimitedPerConflict());
    }
}
