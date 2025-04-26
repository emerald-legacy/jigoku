import AbilityDsl from '../../../abilitydsl';
import type { Conflict } from '../../../conflict';
import DrawCard from '../../../drawcard';

export default class ChroniclesOfValor extends DrawCard {
    static id = 'chronicles-of-valor';

    setupCardAbilities() {
        this.reaction({
            title: 'Discard a character',
            when: {
                afterConflict: ({ conflict }: { conflict: Conflict }, context) =>
                    conflict.winner === context.player && conflict.attackerSkill + conflict.defenderSkill >= 30
            },
            gameAction: AbilityDsl.actions.takeHonor((context) => ({
                amount: context.player.isCharacterTraitInPlay('storyteller') ? 2 : 1
            })),
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}
