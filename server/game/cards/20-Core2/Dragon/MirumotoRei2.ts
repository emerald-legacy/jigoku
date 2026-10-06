import { Duration, DuelType, ConflictType } from '../../../Constants.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { modifyDuelSkill } from '../../../effects.js';
import { duelLastingEffect, injure } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class MirumotoRei2 extends DrawCard {
    static id = 'mirumoto-rei-2';

    private getWeaponCount(context: AbilityContext) {
        return context.source.attachments.filter((card) => card.hasTrait('weapon')).length;
    }

    setupCardAbilities() {
        this.duelChallenge('Help a character with a duel', (duel, context) =>
            duel.participants.includes(context.source) && this.getWeaponCount(context) > 0)
            .gameAction(duelLastingEffect((context) => ({
                target: context.event.duel,
                effect: modifyDuelSkill({
                    amount: this.getWeaponCount(context),
                    player: context.player
                }),
                duration: Duration.UntilEndOfDuel
            })))
            .effect('add {1} to their duel total', (context) => [this.getWeaponCount(context)]);

        this.action('Duel an opposing character')
            .condition((context) => context.game.isDuringConflict(ConflictType.Military))
            .initiateDuel(() => ({
                type: DuelType.Military,
                gameAction: (duel) => injure({ target: duel.loser ?? [] })
            }));
    }
}
