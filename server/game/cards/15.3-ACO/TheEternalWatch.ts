import { CardType, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class TheEternalWatch extends ProvinceCard {
    static id = 'the-eternal-watch';

    setupCardAbilities() {
        this.action('Bow a character or take an honor from your opponent')
            .target('character', {
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isAttacking() && card.allowGameAction('bow', context)
            })
            .select('select', {
                dependsOn: 'character',
                player: Players.Opponent
            }, {
                'Bow this character': AbilityDsl.actions.bow((context) => ({
                    target: context.targets.character
                })),
                'Give your opponent 1 honor': AbilityDsl.actions.takeHonor()
            })
            .effect('{1}{2}', (context) =>
                context.selects.select.choice === 'Give your opponent 1 honor'
                    ? ['take 1 honor from ', context.player.opponent]
                    : ['bow ', context.targets.character]);
    }
}
