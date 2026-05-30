import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import { CardTypes, FavorTypes, Players } from '../../../Constants.js';
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
                if(favor === FavorTypes.Military || favor === FavorTypes.Both) {
                    gameActions.push(
                        AbilityDsl.actions.lookAt((context) => ({
                            target: context.player.opponent.hand.slice().sort((a: BaseCard, b: BaseCard) => a.name.localeCompare(b.name)),
                            chatMessage: true
                        }))
                    );
                }
                if(favor === FavorTypes.Political || favor === FavorTypes.Both) {
                    gameActions.push(
                        AbilityDsl.actions.selectCard({
                            effect: 'force {0} to dishonor one of their characters',
                            effectArgs: () => [],
                            cardType: CardTypes.Character,
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
