import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Players } from '../../Constants.js';

class CleanseTheEmpire extends DrawCard {
    static id = 'cleanse-the-empire';

    setupCardAbilities() {
        this.reaction({
            title: 'Remove a fate from opponent\'s characters',
            when: {
                afterConflict: (event, context) => context.player.opponent && context.player.isAttackingPlayer() && event.conflict.winner === context.player
            },
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.removeFate(context => ({
                    target: context.player.opponent?.filterCardsInPlay((card: any) => card.getType() === CardType.Character) ?? []
                })),
                AbilityDsl.actions.selectCard({
                    activePromptTitle: 'Choose a character to bow',
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    targets: true,
                    cardCondition: (card: any) => card.getFate() === 0,
                    gameAction: AbilityDsl.actions.bow(),
                    message: '{0} chooses to bow {1}',
                    messageArgs: (card: any, player: any) => [player, card]
                })
            ])
        });
    }
}


export default CleanseTheEmpire;
