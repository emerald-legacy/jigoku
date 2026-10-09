import { msg } from '../../GameChat.js';
import { DuelType } from '../../Constants.js';
import type { Duel } from '../../Duel.js';
import { joint, removeFate } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';

export default class MirumotoDojo extends DrawCard {
    static id = 'mirumoto-dojo';

    setupCardAbilities() {
        this.action('Initiate a military duel')
            .initiateDuel(() => ({
                type: DuelType.Military,
                chatText: (_context, duel) =>
                    duel.loser ? (this.wonByDuelist(duel)
                        ? msg`discard 1 fate from ${duel.loser}`
                        : msg`move 1 fate from ${duel.loser} to ${this.loserOwner(duel)}'s pool`)
                        : msg`no effect`,
                gameAction: (duel) =>
                    joint(
                        duel.loser ? duel.loser.map((loserChar) =>
                            removeFate({
                                target: loserChar,
                                recipient: this.wonByDuelist(duel) ? undefined : loserChar.owner
                            })
                        ) : []
                    )
            }));
    }

    private wonByDuelist(duel: Duel): boolean {
        return duel.winner?.some((char) => char.hasTrait('duelist')) ?? false;
    }

    private loserOwner(duel: Duel): undefined | Player {
        return duel.loser?.[0]?.owner;
    }
}
