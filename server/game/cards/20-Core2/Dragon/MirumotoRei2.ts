import { DuelType, ConflictType } from '../../../Constants.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { modifyDuelTotal } from '../../../effects.js';
import { injure } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class MirumotoRei2 extends DrawCard {
    static id = 'mirumoto-rei-2';

    private getWeaponCount(context: AbilityContext) {
        return context.source.attachments.filter((card) => card.hasTrait('weapon')).length;
    }

    setupCardAbilities() {
        this.duelChallenge('Help a character with a duel', (duel, context) =>
            duel.participants.includes(context.source) && this.getWeaponCount(context) > 0)
            .duelLastingEffect((context) => ({
                effect: modifyDuelTotal({
                    amount: this.getWeaponCount(context),
                    player: context.player
                })
            }))
            .chatText((context) => msg`add ${this.getWeaponCount(context)} to their duel total`);

        this.conflictAction('Duel an opposing character', { conflictType: ConflictType.Military })
            .initiateDuel(() => ({
                type: DuelType.Military,
                gameAction: (duel) => injure({ target: duel.loser ?? [] })
            }));
    }
}
