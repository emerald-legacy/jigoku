import { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

function penalty(context: AbilityContext): number {
    const ringsBase = [context.game.rings.air, context.game.rings.earth, context.game.rings.fire, context.game.rings.void, context.game.rings.water];
    const rings = ringsBase.filter(a => a.isUnclaimed() && a.fate > 0);


    return -1 * (2 + 2 * rings.length);
}

export default class TheHundredHandStrike extends DrawCard {
    static id = 'the-hundred-hand-strike';

    setupCardAbilities() {
        this.action('Give a skill penalty to a participating character')
            .condition((context) => context.game.isDuringConflict())
            .target('puncher', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating() && card.hasTrait('monk')
            })
            .target('punchee', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating()
            })
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.targets.punchee,
                effect: AbilityDsl.effects.modifyBothSkills(penalty(context))
            })))
            .effect('give {4} {1}{2} and {1}{3}', (context) => [penalty(context), 'military', 'political', context.targets.punchee])
            .then((context) => {
                const ctx = context;
                return {
                    thenCondition: () => (ctx.targets.puncher).hasTrait('tattooed') &&
                        ctx.game.currentConflict !== null &&
                        ctx.game.currentConflict.calculateSkillFor([ctx.targets.punchee]) === 0,
                    gameAction: AbilityDsl.actions.conditional({
                        condition: () => (ctx.targets.punchee).getFate() === 0,
                        trueGameAction: AbilityDsl.actions.discardFromPlay({ target: ctx.targets.punchee }),
                        falseGameAction: AbilityDsl.actions.removeFate({ target: ctx.targets.punchee })
                    }),
                    message: '{3} is injured because it is not contributing skill to the current conflict',
                    messageArgs: () => [ctx.targets.punchee]
                };
            })
            .max(AbilityDsl.limit.perConflict(1));
    }
}
