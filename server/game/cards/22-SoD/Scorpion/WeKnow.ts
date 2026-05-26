import { CardTypes, TargetModes, Players, CharacterStatus } from '../../../Constants.js';

import { StatusToken } from '../../../StatusToken.js';
import AbilityDsl from '../../../abilitydsl.js';
import BaseCard from '../../../basecard.js';
import DrawCard from '../../../drawcard.js';

export default class WeKnow extends DrawCard {
    static id = 'we-know';

    setupCardAbilities() {
        this.action({
            title: 'Choose an honored status token',
            cost: AbilityDsl.costs.bow({
                cardType: CardTypes.Character,
                cardCondition: (card: BaseCard) => card.hasTrait('courtier')
            }),
            cannotTargetFirst: true,
            targets: {
                token: {
                    mode: TargetModes.Token,
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    tokenCondition: token => {
                        return token.grantedStatus === CharacterStatus.Honored;
                    }
                },
                select: {
                    dependsOn: 'token',
                    mode: TargetModes.Select,
                    player: Players.Opponent,
                    choices: ((context: any) => {
                        const targetToken: StatusToken = context.tokens.token[0];
                        const targetCard = targetToken.card;
                        if(!(targetCard instanceof DrawCard)) {
                            return {};
                        }
                        return {
                            [`Dishonor ${targetCard.name}`]: AbilityDsl.actions.joint([
                                AbilityDsl.actions.discardStatusToken({ target: targetToken }),
                                AbilityDsl.actions.gainStatusToken({ target: targetCard, token: CharacterStatus.Dishonored })
                            ]),
                            'Lose honor and let opponent draw cards': AbilityDsl.actions.joint([
                                AbilityDsl.actions.loseHonor({ target: context.player.opponent }),
                                AbilityDsl.actions.draw({ target: context.player, amount: 2 })
                            ])
                        };
                    }) as any
                }
            },
            then: context => ({
                thenCondition: () => !!context && !!context.player.opponent && context.player.honor > (context.player.opponent.honor ?? 0),
                gameAction: AbilityDsl.actions.loseHonor({
                    target: context?.player,
                    amount: 2
                }),
                message: '{3} loses 2 honor',
                messageArgs: () => [context?.player]
            }),
            effect: '{1}{2}{3}',
            effectArgs: (context) => {
                if(context.selects.select.choice === 'Lose honor and let opponent draw cards') {
                    return [
                        'draw two cards and cause ',
                        context.player.opponent,
                        ' to lose 1 honor'
                    ];
                }
                return [
                    'replace ',
                    context.tokens.token[0].card,
                    ' honored status token with a dishonored status token'
                ];

            }
        });
    }
}
