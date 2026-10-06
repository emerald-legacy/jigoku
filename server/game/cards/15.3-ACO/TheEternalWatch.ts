import { CardType, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { bow, takeHonor } from '../../GameActions/GameActions.js';

export default class TheEternalWatch extends ProvinceCard {
    static id = 'the-eternal-watch';

    setupCardAbilities() {
        this.action('Bow a character or take an honor from your opponent')
            .target({
                name: 'character',
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isAttacking() && card.allowGameAction('bow', context)
            })
            .select({
                name: 'select',
                dependsOn: 'character',
                player: Players.Opponent
            }, {
                'Bow this character': bow((context) => ({
                    target: context.targets.character
                })),
                'Give your opponent 1 honor': takeHonor()
            })
            .effect('{1}{2}', (context) =>
                context.selects.select.choice === 'Give your opponent 1 honor'
                    ? ['take 1 honor from ', context.player.opponent]
                    : ['bow ', context.targets.character]);
    }
}
