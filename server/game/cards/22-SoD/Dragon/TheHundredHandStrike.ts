import { AbilityContext } from '../../../AbilityContext.js';
import { CardTypes, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

function penalty(context: AbilityContext): number {
    const ringsBase = [context.game.rings.air, context.game.rings.earth, context.game.rings.fire, context.game.rings.void, context.game.rings.water];
    const rings = ringsBase.filter(a => a.isUnclaimed() && a.fate > 0);


    return -1 * (2 + 2 * rings.length);
}

export default class TheHundredHandStrike extends DrawCard {
    static id = 'the-hundred-hand-strike';

    setupCardAbilities() {
        this.action({
            title: 'Give a skill penalty to a participating character',
            condition: (context) => context.game.isDuringConflict(),
            max: AbilityDsl.limit.perConflict(1),
            targets: {
                puncher: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: (card) => card.isParticipating() && card.hasTrait('monk')
                },
                punchee: {
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: (card) => card.isParticipating()
                }
            },
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.targets.punchee,
                effect: AbilityDsl.effects.modifyBothSkills(penalty(context))
            })),
            then: (context) => {
                const ctx = context;
                return {
                    thenCondition: () => (ctx.targets.puncher as DrawCard).hasTrait('tattooed') &&
                        ctx.game.currentConflict !== null &&
                        ctx.game.currentConflict.calculateSkillFor([ctx.targets.punchee as DrawCard]) === 0,
                    gameAction: AbilityDsl.actions.conditional({
                        condition: () => (ctx.targets.punchee as DrawCard).getFate() === 0,
                        trueGameAction: AbilityDsl.actions.discardFromPlay({ target: ctx.targets.punchee }),
                        falseGameAction: AbilityDsl.actions.removeFate({ target: ctx.targets.punchee })
                    }),
                    message: '{3} is injured because it is not contributing skill to the current conflict',
                    messageArgs: () => [ctx.targets.punchee]
                };
            },
            effect: 'give {4} {1}{2} and {1}{3}',
            effectArgs: (context) => [penalty(context), 'military', 'political', context.targets.punchee]
        });
    }
}
