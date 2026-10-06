import type { AbilityContext } from '../../../AbilityContext.js';
import type BaseCard from '../../../BaseCard.js';
import type { Event } from '../../../Events/Event.js';
import { CardType, Players, TargetMode, EventName, ConflictType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { resolveAbilityAgain } from '../../resolveAgain.js';

export default class ALegionOfOne extends DrawCard {
    static id = 'a-legion-of-one';

    setupCardAbilities() {
        this.conflictAction('Give a solitary character +3/+0', { conflictType: ConflictType.Military })
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    card.isParticipating() &&
                    this.game.currentConflict !== null &&
                    this.game.currentConflict.getNumberOfParticipantsFor(context.player) === 1
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.modifyMilitarySkill(3)
            }))
            .effect('give {0} +3/+0')
            .then((context) => {
                if(context.subResolution) {
                    return {
                        target: {
                            mode: TargetMode.Select,
                            choices: {
                                'Remove 1 fate for no effect': AbilityDsl.actions.removeFate({
                                    target: context.target
                                }),
                                Done: () => true
                            }
                        },
                        message: '{0} chooses {3}to remove a fate for no effect',
                        messageArgs: (innerContext: AbilityContext) => [innerContext.select === 'Done' ? 'not ' : '']
                    };
                }
                return {
                    target: {
                        mode: TargetMode.Select,
                        choices: {
                            'Remove 1 fate to resolve this ability again': AbilityDsl.actions.removeFate({
                                target: context.target
                            }),
                            Done: () => true
                        }
                    },
                    message: '{0} chooses {3}to remove a fate to resolve {1} again',
                    messageArgs: (innerContext: AbilityContext) => [innerContext.select === 'Done' ? 'not ' : ''],
                    then: {
                        thenCondition: (event: Event & { origin?: BaseCard }) =>
                            event.origin === context.target && !event.cancelled && event.name === EventName.OnMoveFate,
                        gameAction: resolveAbilityAgain(context)
                    }
                };
            });
    }
}
