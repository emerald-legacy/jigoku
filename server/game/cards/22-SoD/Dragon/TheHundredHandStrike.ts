import { AbilityContext } from '../../../AbilityContext';
import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

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
            then: context => ({
                thenCondition: () => context.targets.puncher.hasTrait('tattooed') &&
                    context.game.currentConflict.calculateSkillFor([context.targets.punchee]) === 0,
                gameAction: AbilityDsl.actions.conditional({
                    condition: () => context.targets.punchee.getFate() === 0,
                    trueGameAction: AbilityDsl.actions.discardFromPlay({ target: context.targets.punchee }),
                    falseGameAction: AbilityDsl.actions.removeFate({ target: context.targets.punchee })
                }),
                message: '{3} is injured because it is not contributing skill to the current conflict',
                messageArgs: () => [context.targets.punchee]
            }),
            effect: 'give {4} {1}{2} and {1}{3}',
            effectArgs: (context) => [penalty(context), 'military', 'political', context.targets.punchee]
        });
    }
}
