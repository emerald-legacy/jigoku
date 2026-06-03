import { Duration, DuelType, ConflictType } from '../../../Constants.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { LastingEffectProperties } from '../../../GameActions/LastingEffectAction.js';
import type { GameAction } from '../../../GameActions/GameAction.js';

export default class MirumotoRei2 extends DrawCard {
    static id = 'mirumoto-rei-2';

    getWeaponCount(context: AbilityContext) {
        return context.source.attachments.filter((card: any) => card.hasTrait('weapon')).length;
    }

    setupCardAbilities() {
        this.duelChallenge({
            title: 'Help a character with a duel',
            duelCondition: (duel, context) =>
                duel.participants.includes(context.source) && this.getWeaponCount(context) > 0,
            gameAction: AbilityDsl.actions.duelLastingEffect((context) => ({
                target: (context as TriggeredAbilityContext).event.duel,
                effect: AbilityDsl.effects.modifyDuelSkill({
                    amount: this.getWeaponCount(context),
                    player: context.player
                }),
                duration: Duration.UntilEndOfDuel
            } as LastingEffectProperties)),
            effect: 'add {1} to their duel total',
            effectArgs: (context) => [this.getWeaponCount(context)]
        });

        this.action({
            title: 'Duel an opposing character',
            condition: (context) => context.game.isDuringConflict(ConflictType.Military),
            initiateDuel: {
                type: DuelType.Military,
                message: 'injure {0}',
                messageArgs: (duel) => [duel.loser],
                gameAction: ((duel: any) =>
                    duel.loser &&
                    AbilityDsl.actions.multipleContext(() => {
                        const gameActions: GameAction[] = [];
                        duel.loser.forEach((loser: any) => {
                            if(loser.getFate() > 0) {
                                gameActions.push(
                                    AbilityDsl.actions.removeFate({
                                        target: loser,
                                        amount: 1
                                    })
                                );
                            } else {
                                gameActions.push(
                                    AbilityDsl.actions.discardFromPlay({
                                        target: loser
                                    })
                                );
                            }
                        });
                        return { gameActions };
                    })) as any
            }
        });
    }
}
