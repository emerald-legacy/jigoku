import { msg } from '../../GameChat.js';
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
                cardCondition: (card, context) => card.isAttacking() && bow().canAffect(card, context)
            })
            .select({
                name: 'select',
                dependsOn: 'character',
                player: Players.Opponent
            }, {
                'Bow this character': {
                    action: bow((context) => ({
                        target: context.targets.character
                    })),
                    chatText: (context) => msg`bow ${context.targets.character}`
                },
                'Give your opponent 1 honor': {
                    action: takeHonor(),
                    chatText: (context) => msg`${'take 1 honor from '}${context.player.opponent}`
                }
            });
    }
}
