import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import { ConflictTypes } from '../../../Constants';

export default class DeadEyes extends DrawCard {
    static id = 'dead-eyes';

    public setupCardAbilities() {
        this.attachmentConditions({ trait: 'berserker' });

        this.whileAttached({
            match: _card => true,
            effect: AbilityDsl.effects.setGlory(0)
        });

        this.action({
            title: 'Increase a character\'s military skill',
            condition: context => context.game.isDuringConflict(ConflictTypes.Military) && context.source.parent,
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.source.parent,
                effect: [
                    AbilityDsl.effects.modifyMilitarySkill(2),
                    AbilityDsl.effects.cardCannot({
                        cannot: 'sendHome',
                        restricts: 'opponentsCardEffects',
                        applyingPlayer: context.player
                    }),
                    AbilityDsl.effects.delayedEffect({
                        when: {
                            afterConflict: event => {
                                if(!context.source.parent) {
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
                        gameAction: AbilityDsl.actions.sacrifice(),
                        message: '{0} is sacrificed due to the delayed effect of {1}',
                        messageArgs: [context.source.parent, context.source]
                    })
                ]
            })),
            effect: 'grant +2{2} to {1}, prevent them from being moved home. They will be sacrificed if they don\'t win the conflict by enough skill',
            effectArgs: context => [context.source.parent, 'military']
        });
    }
}
