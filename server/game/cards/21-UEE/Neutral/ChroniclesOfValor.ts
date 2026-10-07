import { perConflict } from '../../../AbilityLimit.js';
import DrawCard from '../../../DrawCard.js';

export default class ChroniclesOfValor extends DrawCard {
    static id = 'chronicles-of-valor';

    setupCardAbilities() {
        this.reaction('Take honor from your opponent')
            .when({
                afterConflict: ({ conflict }, context) =>
                    conflict.winner === context.player && conflict.attackerSkill + conflict.defenderSkill >= 25
            })
            .takeHonor((context) => ({
                amount: context.player.isCharacterTraitInPlay('storyteller') ? 2 : 1
            }))
            .max(perConflict(1));
    }
}
