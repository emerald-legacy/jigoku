import { DuelType, Players, ConflictType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { bow, chooseAction, takeHonor } from '../../../GameActions/GameActions.js';

export default class IkomaUjio extends DrawCard {
    static id = 'ikoma-ujio';

    setupCardAbilities() {
        this.conflictAction('Military duel to bow', { conflictType: ConflictType.Political })
            .initiateDuel(() => ({
                type: DuelType.Military,
                message: '{0} chooses whether to bow {1} or give 1 honor to {2}',
                messageArgs: (duel) => [duel.loserController, duel.loser, duel.winnerController],
                gameAction: (duel, context) => chooseAction({
                    target: duel.loser,
                    player: duel.loserController !== context.source.controller ? Players.Opponent : Players.Self,
                    options: {
                        'Give opponent 1 honor': {
                            action: takeHonor({
                                target: duel.loserController
                            }),
                            message: '{0} chooses to give 1 honor to their opponent'
                        },
                        'Bow duel loser': {
                            action: bow(),
                            message: '{0} chooses to bow {1}'
                        }
                    }
                })
            }));
    }
}
