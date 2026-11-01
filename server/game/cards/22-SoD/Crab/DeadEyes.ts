import { msg } from '../../../GameChat.js';
import { cardCannot, modifyMilitarySkill, setGlory } from '../../../effects.js';
import { sacrifice } from '../../../GameActions/GameActions.js';
import type { Conflict } from '../../../Conflict.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';
import { ConflictType, RestrictionType, Trait } from '../../../Constants.js';

export default class DeadEyes extends DrawCard {
    static id = 'dead-eyes';

    public override setupCardAbilities() {
        this.attachmentConditions({ trait: Trait.Berserker });

        this.whileAttached({
            effect: setGlory(0)
        });

        this.conflictAction('Increase a character\'s military skill', { conflictType: ConflictType.Military })
            .cardLastingEffect((context) => ({
                target: context.source.parentCharacter ?? [],
                effect: [
                    modifyMilitarySkill(2),
                    cardCannot(RestrictionType.SendHome)
                ]
            }))
            .atEndOfConflict((context) => {
                const conflict = context.game.currentConflict;
                return {
                    target: context.source.parentCharacter ?? [],
                    onlyIf: () => !!conflict && !this.contributedMoreThanDouble(conflict, context.source.controller),
                    message: () => msg`${context.source.parentCharacter} is sacrificed due to the delayed effect of ${context.source}`,
                    gameAction: sacrifice()
                };
            })
            .chatText((context) => msg`grant +2${'military'} to ${context.source.parentCharacter ?? ''}, prevent them from being moved home. They will be sacrificed if they don't win the conflict by enough skill`);
    }

    private contributedMoreThanDouble(conflict: Conflict, player: Player): boolean {
        if(conflict.winner !== player) {
            return false;
        }
        const isAttacker = conflict.attackingPlayer === player;
        const mySkill = isAttacker ? conflict.attackerSkill : conflict.defenderSkill;
        const opponentSkill = isAttacker ? conflict.defenderSkill : conflict.attackerSkill;
        return mySkill > opponentSkill * 2;
    }
}
