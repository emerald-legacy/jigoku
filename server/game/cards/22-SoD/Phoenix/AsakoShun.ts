import { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

function penalty(context: AbilityContext): number {
    const conflict = context.game.currentConflict;
    if(!conflict) {
        return 0;
    }
    const scholars = conflict.getNumberOfParticipantsFor(context.player, card => card.hasTrait('scholar'));
    return -2 * scholars;
}

export default class AsakoShun extends DrawCard {
    static id = 'asako-shun';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Give a skill penalty to a participating character',
            condition: (context) => context.source.isParticipating(),
            target: {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                    effect: AbilityDsl.effects.modifyBothSkills(penalty(context))
                }))
            },
            then: (context) => ({
                thenCondition: () => {
                    const conflict = context?.game.currentConflict;
                    const target = context?.target;
                    return !!conflict && !!target && conflict.calculateSkillFor([target]) === 0;
                },
                gameAction: AbilityDsl.actions.gainHonor({
                    target: context?.player,
                    amount: 1
                }),
                message: '{4} gains 1 honor because {3} is not contributing skill to the current conflict',
                messageArgs: () => [context?.target, context?.player]
            }),
            effect: 'give {4} {1}{2} and {1}{3}',
            effectArgs: (context) => [penalty(context), 'military', 'political', context.target ?? '']
        });
    }
}
