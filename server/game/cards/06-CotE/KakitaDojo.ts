import { msg } from '../../GameChat.js';
import { DuelType } from '../../Constants.js';
import type { Duel } from '../../Duel.js';
import { cannotTriggerAbilities } from '../../effects.js';
import { bow, cardLastingEffect, multiple } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class KakitaDojo extends DrawCard {
    static id = 'kakita-dojo';

    setupCardAbilities() {
        this.action('Initiate a military duel')
            .initiateDuel(() => ({
                type: DuelType.Military,
                chatText: (_context, duel) => msg`${duel.loser} ${this.wonByDuelist(duel) ? 'is bowed and ' : ''}cannot trigger its abilities until the end of the conflict`,
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

    private wonByDuelist(duel: Duel): boolean {
        return duel.winner?.some((char) => char.hasTrait('duelist')) ?? false;
    }
}
