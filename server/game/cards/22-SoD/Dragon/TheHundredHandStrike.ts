import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { modifyBothSkills } from '../../../effects.js';
import { injure } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

function penalty(context: AbilityContext): number {
    const ringsBase = [context.game.rings.air, context.game.rings.earth, context.game.rings.fire, context.game.rings.void, context.game.rings.water];
    const rings = ringsBase.filter(a => a.isUnclaimed() && a.fate > 0);


    return -1 * (2 + 2 * rings.length);
}

export default class TheHundredHandStrike extends DrawCard {
    static id = 'the-hundred-hand-strike';

    setupCardAbilities() {
        this.conflictAction('Give a skill penalty to a participating character')
            .target({
                name: 'puncher',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating() && card.hasTrait('monk')
            })
            .target({
                name: 'punchee',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            })
            .cardLastingEffect((context) => ({
                target: context.targets.punchee,
                effect: modifyBothSkills(penalty(context))
            }))
            .effect('give {4} {1}{2} and {1}{3}', (context) => [penalty(context), 'military', 'political', context.targets.punchee])
            .max(AbilityDsl.limit.perConflict(1))
            .thenIf((context) => context.targets.puncher.hasTrait('tattooed') &&
                context.game.currentConflict !== null &&
                context.game.currentConflict.calculateSkillFor([context.targets.punchee]) === 0)
            .gameAction(injure((context) => ({ target: context.targets.punchee })))
            .message((context) => msg`${context.targets.punchee} is injured because it is not contributing skill to the current conflict`);
    }
}
