import { CardType, TargetMode, Players, CharacterStatus } from '../../../Constants.js';

import { StatusToken } from '../../../StatusToken.js';
import AbilityDsl from '../../../abilitydsl.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import type { ChoicesInterface } from '../../../Interfaces.js';
import BaseCard from '../../../BaseCard.js';
import DrawCard from '../../../DrawCard.js';
import type Player from '../../../Player.js';

export default class WeKnow extends DrawCard {
    static id = 'we-know';

    setupCardAbilities() {
        this.action({
            title: 'Choose an honored status token',
            cost: AbilityDsl.costs.bow({
                cardType: CardType.Character,
                cardCondition: (card: BaseCard) => card.hasTrait('courtier')
            }),
            cannotTargetFirst: true,
            targets: {
                token: {
                    mode: TargetMode.Token,
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    tokenCondition: token => {
                        return token.grantedStatus === CharacterStatus.Honored;
                    }
                },
                select: {
                    dependsOn: 'token',
                    mode: TargetMode.Select,
                    player: Players.Opponent,
                    choices: (context: AbilityContext): ChoicesInterface => {
                        const targetToken = (context.tokens.token as StatusToken[])[0];
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
                    }
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
                        context.player.opponent as Player,
                        ' to lose 1 honor'
                    ];
                }
                return [
                    'replace ',
                    (context.tokens.token as StatusToken[])[0].card as DrawCard,
                    ' honored status token with a dishonored status token'
                ];

            }
        });
    }
}
