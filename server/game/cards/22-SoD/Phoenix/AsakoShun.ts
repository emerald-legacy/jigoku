import { AbilityContext } from '../../../AbilityContext';
import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

function penalty(context: AbilityContext): number {
    const scholars = context.game.currentConflict.getNumberOfParticipantsFor(context.player, card => card.hasTrait('scholar'));
    return -2 * scholars;
}

export default class AsakoShun extends DrawCard {
    static id = 'asako-shun';

    setupCardAbilities() {
        this.action({
            title: 'Give a skill penalty to a participating character',
            condition: (context) => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                    effect: AbilityDsl.effects.modifyBothSkills(penalty(context))
                }))
            },
            then: context => ({
                thenCondition: () => context.game.currentConflict.calculateSkillFor([context.target]) === 0,
                gameAction: AbilityDsl.actions.gainHonor({
                    target: context.player,
                    amount: 1
                }),
                message: '{4} gains 1 honor because {3} is not contributing skill to the current conflict',
                messageArgs: () => [context.target, context.player]
            }),
            effect: 'give {4} {1}{2} and {1}{3}',
            effectArgs: (context) => [penalty(context), 'military', 'political', context.target]
        });
    }
}
