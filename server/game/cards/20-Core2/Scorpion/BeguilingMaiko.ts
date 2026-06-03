import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import { CardType, FavorType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { GameAction } from '../../../GameActions/GameAction.js';

export default class BeguilingMaiko extends DrawCard {
    static id = 'beguiling-maiko';

    setupCardAbilities() {
        this.reaction({
            title: 'Employ your charm',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.sequentialContext((context) => {
                const favor = context.game.getFavorSide();
                if(favor === undefined) {
                    return {
                        gameActions: [AbilityDsl.actions.claimImperialFavor((context) => ({ target: context.player }))]
                    };
                }
                const gameActions: Array<GameAction> = [];
                if(favor === FavorType.Military || favor === FavorType.Both) {
                    gameActions.push(
                        AbilityDsl.actions.lookAt((context) => ({
                            target: context.player.opponent.hand.slice().sort((a: BaseCard, b: BaseCard) => a.name.localeCompare(b.name)),
                            chatMessage: true
                        }))
                    );
                }
                if(favor === FavorType.Political || favor === FavorType.Both) {
                    gameActions.push(
                        AbilityDsl.actions.selectCard({
                            effect: 'force {0} to dishonor one of their characters',
                            effectArgs: (context) => [context.player.opponent ?? ''],
                            cardType: CardType.Character,
                            player: Players.Opponent,
                            controller: Players.Opponent,
                            gameAction: AbilityDsl.actions.dishonor(),
                            message: '{0} dishonors {1}',
                            messageArgs: (card, player) => [player, card]
                        })
                    );
                }
                return { gameActions };
            })
        });
    }
}
