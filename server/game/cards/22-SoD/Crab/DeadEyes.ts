import { msg } from '../../../GameChat.js';
import { cardCannot, delayedEffect, modifyMilitarySkill, setGlory } from '../../../effects.js';
import { sacrifice } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { ConflictType, RestrictionType } from '../../../Constants.js';

export default class DeadEyes extends DrawCard {
    static id = 'dead-eyes';

    public setupCardAbilities() {
        this.attachmentConditions({ trait: 'berserker' });

        this.whileAttached({
            effect: setGlory(0)
        });

        this.conflictAction('Increase a character\'s military skill', { conflictType: ConflictType.Military })
            .cardLastingEffect((context) => ({
                target: context.source.parentCharacter ?? [],
                effect: [
                    modifyMilitarySkill(2),
                    cardCannot({
                        cannot: RestrictionType.SendHome,
                        restricts: 'opponentsCardEffects',
                        applyingPlayer: context.player
                    }),
                    delayedEffect({
                        when: {
                            afterConflict: (event) => {
                                if(!context.source.parentCharacter) {
                                    return false;
                                }
                                if(context.source.controller !== event.conflict.winner) {
                                    return true;
                                }
                                const controllerIsAttacker = event.conflict.attackingPlayer === context.source.controller;
                                const mySkill = controllerIsAttacker ? event.conflict.attackerSkill : event.conflict.defenderSkill;
                                const opponentSkill = controllerIsAttacker ? event.conflict.defenderSkill : event.conflict.attackerSkill;
                                return mySkill <= opponentSkill * 2;
                            }
                        },
                        gameAction: sacrifice(),
                        message: () => msg`${context.source.parentCharacter} is sacrificed due to the delayed effect of ${context.source}`
                    })
                ]
            }))
            .chatText((context) => msg`grant +2${'military'} to ${context.source.parentCharacter ?? ''}, prevent them from being moved home. They will be sacrificed if they don't win the conflict by enough skill`);
    }
}
