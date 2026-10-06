import { DuelType, Duration, FavorType } from '../../../Constants.js';
import { modifyDuelSkill } from '../../../effects.js';
import { bow, claimImperialFavor, duelLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class SeppunRyo extends DrawCard {
    static id = 'seppun-ryo';

    public setupCardAbilities() {
        this.duelFocus('Help a character with a duel', (duel, context) =>
            context.player.imperialFavor !== '' && duel.participants.includes(context.source)
        )
            .gameAction(duelLastingEffect((context) => ({
                target: context.event.duel,
                effect: modifyDuelSkill({ amount: 1, player: context.player }),
                duration: Duration.UntilEndOfDuel
            })))
            .effect('add 1 to their duel total');

        this.conflictAction('Initiate a military duel to bow')
            .initiateDuel((context) => {
                const opponentFavor = context.player.opponent?.imperialFavor;
                return {
                    type: DuelType.Military,
                    refuseGameAction: opponentFavor !== ''
                        ? claimImperialFavor({ target: context.player, side: this.getFavorSide(opponentFavor) })
                        : undefined,
                    refusalMessage: '{0} chooses to refuse the duel and give the imperial favor to {1}',
                    refusalMessageArgs: (context) => [context.player.opponent, context.player],
                    gameAction: (duel) => bow({ target: duel.loser })
                };
            });
    }

    getFavorSide(favor: string | undefined) {
        switch(favor) {
            case 'military':
                return FavorType.Military;
            case 'political':
                return FavorType.Political;
            default:
                return FavorType.Both;
        }
    }
}
