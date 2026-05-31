import type { AbilityContext } from '../../../AbilityContext.js';
import type CardAbility from '../../../CardAbility.js';
import { CardTypes, Players, TargetModes, EventNames } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class ALegionOfOne extends DrawCard {
    static id = 'a-legion-of-one';

    setupCardAbilities() {
        this.action({
            title: 'Give a solitary character +3/+0',
            condition: () => this.game.isDuringConflict('military'),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    card.isParticipating() &&
                    this.game.currentConflict !== null &&
                    this.game.currentConflict.getNumberOfParticipantsFor(context.player) === 1,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.modifyMilitarySkill(3)
                })
            },
            effect: 'give {0} +3/+0',
            then: (context) => {
                const ctx = context;
                if(ctx.subResolution) {
                    return {
                        target: {
                            mode: TargetModes.Select,
                            choices: {
                                'Remove 1 fate for no effect': AbilityDsl.actions.removeFate({
                                    target: ctx.target
                                }),
                                Done: () => true
                            }
                        },
                        message: '{0} chooses {3}to remove a fate for no effect',
                        messageArgs: (innerContext: AbilityContext) => (innerContext.select === 'Done' ? 'not ' : '')
                    };
                }
                return {
                    target: {
                        mode: TargetModes.Select,
                        choices: {
                            'Remove 1 fate to resolve this ability again': AbilityDsl.actions.removeFate({
                                target: ctx.target
                            }),
                            Done: () => true
                        }
                    },
                    message: '{0} chooses {3}to remove a fate to resolve {1} again',
                    messageArgs: (innerContext: AbilityContext) => (innerContext.select === 'Done' ? 'not ' : ''),
                    then: {
                        thenCondition: (event: any) =>
                            event.origin === ctx.target && !event.cancelled && event.name === EventNames.OnMoveFate,
                        gameAction: AbilityDsl.actions.resolveAbility({
                            ability: ctx.ability as CardAbility,
                            subResolution: true,
                            choosingPlayerOverride: ctx.choosingPlayerOverride ?? undefined
                        })
                    }
                };
            }
        });
    }
}
