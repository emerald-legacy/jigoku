import {
    claimImperialFavor,
    dishonor,
    lookAt,
    selectCard,
    sequentialContext
} from '../../../GameActions/GameActions.js';
import { CardType, FavorType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { GameAction } from '../../../GameActions/GameAction.js';

export default class BeguilingMaiko extends DrawCard {
    static id = 'beguiling-maiko';

    setupCardAbilities() {
        this.reaction('Employ your charm')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .gameAction(sequentialContext((context) => {
                const favor = context.game.getFavorSide();
                if(favor === undefined) {
                    return {
                        gameActions: [claimImperialFavor((context) => ({ target: context.player }))]
                    };
                }
                const gameActions: Array<GameAction> = [];
                if(favor === FavorType.Military || favor === FavorType.Both) {
                    gameActions.push(
                        lookAt((context) => ({
                            target: context.player.opponent?.hand.slice().sort((a, b) => a.name.localeCompare(b.name)),
                            chatMessage: true
                        }))
                    );
                }
                if(favor === FavorType.Political || favor === FavorType.Both) {
                    gameActions.push(
                        selectCard({
                            effect: 'force {0} to dishonor one of their characters',
                            effectArgs: (context) => [context.player.opponent ?? ''],
                            cardType: CardType.Character,
                            player: Players.Opponent,
                            controller: Players.Opponent,
                            gameAction: dishonor(),
                            message: '{0} dishonors {1}',
                            messageArgs: (card, player) => [player, card]
                        })
                    );
                }
                return { gameActions };
            }));
    }
}
