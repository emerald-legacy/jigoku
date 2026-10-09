import { msg } from '../../../GameChat.js';
import { DuelType, Players, ConflictType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { bow, chooseAction, takeHonor } from '../../../GameActions/GameActions.js';

export default class IkomaUjio extends DrawCard {
    static id = 'ikoma-ujio';

    setupCardAbilities() {
        this.conflictAction('Military duel to bow', { conflictType: ConflictType.Political })
            .initiateDuel(() => ({
                type: DuelType.Military,
                chatText: (_context, duel) => msg`${duel.loserController} chooses whether to bow ${duel.loser} or give 1 honor to ${duel.winnerController}`,
                gameAction: (duel, context) => chooseAction({
                    target: duel.loser,
                    player: duel.loserController !== context.source.controller ? Players.Opponent : Players.Self,
                    choices: {
                        'Give opponent 1 honor': {
                            action: takeHonor({
                                target: duel.loserController
                            }),
                            message: (_context, _target, player) => msg`${player} chooses to give 1 honor to their opponent`
                        },
                        'Bow duel loser': {
                            action: bow(),
                            message: (_context, target, player) => msg`${player} chooses to bow ${target}`
                        }
                    }
                })
            }));
    }
}
