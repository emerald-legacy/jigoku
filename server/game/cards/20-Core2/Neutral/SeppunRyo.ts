import { msg } from '../../../GameChat.js';
import { DuelType, FavorType } from '../../../Constants.js';
import { modifyDuelSkill } from '../../../effects.js';
import { bow, claimImperialFavor } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { unlimited } from '../../../AbilityLimit.js';

export default class SeppunRyo extends DrawCard {
    static id = 'seppun-ryo';

    public setupCardAbilities() {
        this.duelFocus('Help a character with a duel', (duel, context) =>
            context.player.imperialFavor !== '' && duel.participants.includes(context.source)
        )
            .duelLastingEffect((context) => ({
                effect: modifyDuelSkill({ amount: 1, player: context.player })
            }))
            .chatText('add 1 to their duel total')
            .limit(unlimited());

        this.conflictAction('Initiate a military duel to bow')
            .initiateDuel((context) => {
                const opponentFavor = context.player.opponent?.imperialFavor;
                return {
                    type: DuelType.Military,
                    refuseGameAction: opponentFavor !== ''
                        ? claimImperialFavor({ target: context.player, side: this.getFavorSide(opponentFavor) })
                        : undefined,
                    refusalMessage: (context, refuser) => msg`${refuser} chooses to refuse the duel and give the imperial favor to ${context.player}`,
                    gameAction: (duel) => bow({ target: duel.loser })
                };
            });
    }

    getFavorSide(favor: string | undefined) {
        switch(favor) {
            case FavorType.Military:
                return FavorType.Military;
            case FavorType.Political:
                return FavorType.Political;
            default:
                return FavorType.Both;
        }
    }
}
