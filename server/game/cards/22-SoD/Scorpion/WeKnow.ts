import { CardType, Players, CharacterStatus } from '../../../Constants.js';

import * as costs from '../../../costs/index.js';
import { discardStatusToken, draw, gainStatusToken, joint, loseHonor } from '../../../GameActions/GameActions.js';
import type { GameAction } from '../../../GameActions/GameAction.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class WeKnow extends DrawCard {
    static id = 'we-know';

    setupCardAbilities() {
        this.action('Choose an honored status token')
            .cost(costs.bow({
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
                    choices[`Dishonor ${targetCard.name}`] = joint([
                        discardStatusToken({ target: targetToken }),
                        gainStatusToken({ target: targetCard, token: CharacterStatus.Dishonored })
                    ]);
                    choices['Lose honor and let opponent draw cards'] = joint([
                        loseHonor({ target: context.player.opponent }),
                        draw({ target: context.player, amount: 2 })
                    ]);
                }
                return choices;
            })
            .chatText('{1}{2}{3}', (context) => {
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
            .cannotTargetFirst()
            .thenIf((context) => !!context.player.opponent && context.player.honor > context.player.opponent.honor)
            .loseHonor(2)
            .message((context) => msg`${context.player} loses 2 honor`);
    }
}
