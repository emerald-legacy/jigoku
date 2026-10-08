import DrawCard from '../../../DrawCard.js';
import { addKeyword } from '../../../effects.js';
import { cardLastingEffect, multipleContext } from '../../../GameActions/GameActions.js';
import { CardType, Players } from '../../../Constants.js';
import type { GameAction } from '../../../GameActions/GameAction.js';

export default class AimiDemagogue extends DrawCard {
    static id = 'aimi-demagogue';

    setupCardAbilities() {
        this.conflictAction('Give pride')
            .target({
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating()
            }, multipleContext((context) => {
                const gameActions: GameAction[] = [];

                gameActions.push(cardLastingEffect({
                    effect: addKeyword('pride'),
                    target: context.target
                }));

                if(context.target.controller !== context.player) {
                    gameActions.push(cardLastingEffect({
                        effect: addKeyword('pride'),
                        target: context.source
                    }));
                }
                return { gameActions };
            }))
            .chatText('give {1}{0} pride until the end of the conflict', (context) => [context.target.controller !== context.player ? 'itself and ' : '']);
    }
}
