import AbilityDsl from '../../../abilitydsl.js';
import type { Conflict } from '../../../Conflict.js';
import DrawCard from '../../../DrawCard.js';

export default class ChroniclesOfValor extends DrawCard {
    static id = 'chronicles-of-valor';

    setupCardAbilities() {
        this.reaction({
            title: 'Take honor from your opponent',
            when: {
                afterConflict: ({ conflict }: { conflict: Conflict }, context) =>
                    conflict.winner === context.player && conflict.attackerSkill + conflict.defenderSkill >= 25
            },
            gameAction: AbilityDsl.actions.takeHonor((context) => ({
                amount: context.player.isCharacterTraitInPlay('storyteller') ? 2 : 1
            })),
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}
