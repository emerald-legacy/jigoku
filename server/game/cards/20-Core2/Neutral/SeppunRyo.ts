import { DuelType, Duration, FavorType } from '../../../Constants.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { LastingEffectProperties } from '../../../GameActions/LastingEffectAction.js';

export default class SeppunRyo extends DrawCard {
    static id = 'seppun-ryo';

    public setupCardAbilities() {
        this.duelFocus({
            title: 'Help a character with a duel',
            duelCondition: (duel, context) =>
                context.player.imperialFavor !== '' && duel.participants.includes(context.source as DrawCard),
            gameAction: AbilityDsl.actions.duelLastingEffect((context) => ({
                target: (context as TriggeredAbilityContext).event.duel,
                effect: AbilityDsl.effects.modifyDuelSkill({ amount: 1, player: context.player }),
                duration: Duration.UntilEndOfDuel
            } as LastingEffectProperties)),
            effect: 'add 1 to their duel total'
        });

        this.action({
            title: 'Initiate a military duel to bow',
            initiateDuel: {
                type: DuelType.Military,
                refuseGameAction: AbilityDsl.actions.claimImperialFavor((context) => ({
                    target: context.player.opponent?.imperialFavor !== '' ? context.player : null,
                    side: this.getFavorSide(context.player.opponent?.imperialFavor)
                })),
                refusalMessage: '{0} chooses to refuse the duel and give the imperial favor to {1}',
                refusalMessageArgs: (context) => [context.player.opponent, context.player],
                gameAction: (duel) => AbilityDsl.actions.bow({ target: duel.loser })
            }
        });
    }

    getFavorSide(favor: string) {
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
