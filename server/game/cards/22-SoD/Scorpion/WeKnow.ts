import { CardType, Players, CharacterStatus } from '../../../Constants.js';

import AbilityDsl from '../../../abilitydsl.js';
import type { GameAction } from '../../../GameActions/GameAction.js';
import DrawCard from '../../../DrawCard.js';

export default class WeKnow extends DrawCard {
    static id = 'we-know';

    setupCardAbilities() {
        this.action('Choose an honored status token')
            .cost(AbilityDsl.costs.bow({
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait('courtier')
            }))
            .tokenTarget({
                name: 'token',
                cardType: CardType.Character,
                controller: Players.Opponent,
                tokenCondition: token => {
                    return token.grantedStatus === CharacterStatus.Honored;
                }
            })
            .selectFrom({
                name: 'select',
                dependsOn: 'token',
                player: Players.Opponent
            }, (context) => {
                const targetToken = context.tokens.token[0];
                const targetCard = targetToken.card;
                const choices: Record<string, GameAction> = {};
                if(targetCard instanceof DrawCard) {
                    choices[`Dishonor ${targetCard.name}`] = AbilityDsl.actions.joint([
                        AbilityDsl.actions.discardStatusToken({ target: targetToken }),
                        AbilityDsl.actions.gainStatusToken({ target: targetCard, token: CharacterStatus.Dishonored })
                    ]);
                    choices['Lose honor and let opponent draw cards'] = AbilityDsl.actions.joint([
                        AbilityDsl.actions.loseHonor({ target: context.player.opponent }),
                        AbilityDsl.actions.draw({ target: context.player, amount: 2 })
                    ]);
                }
                return choices;
            })
            .effect('{1}{2}{3}', (context) => {
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

            })
            .then(context => ({
                thenCondition: () => !!context.player.opponent && context.player.honor > context.player.opponent.honor,
                gameAction: AbilityDsl.actions.loseHonor({
                    target: context.player,
                    amount: 2
                }),
                message: '{3} loses 2 honor',
                messageArgs: () => [context.player]
            }))
            .cannotTargetFirst();
    }
}
