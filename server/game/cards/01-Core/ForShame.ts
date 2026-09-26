import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class ForShame extends DrawCard {
    static id = 'for-shame';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Dishonor or bow a character')
            .condition(context => context.player.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('courtier')))
            .target('character', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating()
            })
            .select('select', {
                dependsOn: 'character',
                player: Players.Opponent
            }, {
                'Dishonor this character': ability.actions.dishonor((context) => ({ target: context.targets.character })),
                'Bow this character': ability.actions.bow((context) => ({ target: context.targets.character }))
            });
    }
}


export default ForShame;
