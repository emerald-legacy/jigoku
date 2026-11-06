import { msg } from '../../GameChat.js';
import { DuelType, Trait } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';
import type { ResolvedDuel } from '../../Duel.js';
import { cannotTriggerAbilities } from '../../effects.js';
import { bow, cardLastingEffect, multiple } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class KakitaDojo extends DrawCard {
    static id = 'kakita-dojo';

    override setupCardAbilities() {
        this.action('Initiate a military duel')
            .initiateDuel(() => ({
                type: DuelType.Military,
                chatText: (context, duel) => this.duelEffectMessage(context, duel),
                gameAction: (duel) =>
                    multiple([
                        cardLastingEffect({
                            target: duel.loser,
                            effect: cannotTriggerAbilities()
                        }),
                        bow({ target: this.wonByDuelist(duel) ? duel.loser : undefined })
                    ])
            }));
    }

    private duelEffectMessage(context: AbilityContext, duel: ResolvedDuel) {
        const losers = duel.loser ?? [];
        const bowed = this.wonByDuelist(duel) ? losers.filter((card) => bow().canAffect(card, context)) : [];
        const its = losers.length === 1 ? 'its' : 'their';
        if(bowed.length === 0) {
            return msg`${losers} cannot trigger ${its} abilities until the end of the conflict`;
        }
        const isBowed = bowed.length === 1 ? 'is bowed' : 'are bowed';
        if(bowed.length === losers.length) {
            return msg`${losers} ${isBowed} and cannot trigger ${its} abilities until the end of the conflict`;
        }
        return msg`${bowed} ${isBowed} and ${losers} cannot trigger ${its} abilities until the end of the conflict`;
    }

    private wonByDuelist(duel: ResolvedDuel): boolean {
        return duel.winner.some((char) => char.hasTrait(Trait.Duelist));
    }
}
