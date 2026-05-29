import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, Players, CharacterStatus } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { StatusToken } from '../../../StatusToken.js';

export default class ForcedRetirement extends DrawCard {
    static id = 'forced-retirement';

    public setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Remove negative status tokens from a character, and discard it from play',
            effect: 'expiate {0}\'s misdeeds by retiring them to the nearest monatery{1} Let them contemplate their sins.',
            effectArgs: (context) => {
                const target = context.target;
                return [
                    target && target.fate > 0 ? ', recovering their ' + target.fate + ' fate.' : '.'
                ];
            },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card) => (card.isDishonored || card.isTainted) && !card.isParticipating()
            },
            gameAction: AbilityDsl.actions.sequentialContext((context) => ({
                gameActions: [
                    AbilityDsl.actions.multiple([
                        AbilityDsl.actions.discardStatusToken({
                            target: [
                                context.target.statusTokens.filter(
                                    (t: StatusToken) =>
                                        t.grantedStatus === CharacterStatus.Dishonored ||
                                        t.grantedStatus === CharacterStatus.Tainted
                                )
                            ]
                        }),
                        AbilityDsl.actions.removeFate({
                            target: context.target,
                            amount: context.target.getFate(),
                            recipient: context.target.owner
                        })
                    ]),
                    AbilityDsl.actions.multiple([
                        AbilityDsl.actions.discardFromPlay({
                            target: context.target
                        }),
                        AbilityDsl.actions.gainHonor({
                            target: context.player,
                            amount: 1
                        })
                    ])
                ]
            }))
        });
    }
}
