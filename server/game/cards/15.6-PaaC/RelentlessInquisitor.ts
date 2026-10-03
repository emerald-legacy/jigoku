import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class RelentlessInquisitor extends DrawCard {
    static id = 'relentless-inquisitor';

    setupCardAbilities() {
        this.action('Remove a fate from or bow a character')
            .condition(context => context.source.isParticipating())
            .target('character', {
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating() && !card.bowed
            })
            .select('select', {
                dependsOn: 'character',
                player: Players.Opponent
            }, {
                'Remove a fate from this character': AbilityDsl.actions.removeFate(context => ({ target: context.targets.character })),
                'Bow this character': AbilityDsl.actions.bow(context => ({ target: context.targets.character }))
            });
    }
}


export default RelentlessInquisitor;
