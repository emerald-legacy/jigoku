import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { bow, removeFate } from '../../GameActions/GameActions.js';

class RelentlessInquisitor extends DrawCard {
    static id = 'relentless-inquisitor';

    setupCardAbilities() {
        this.action('Remove a fate from or bow a character')
            .condition(context => context.source.isParticipating())
            .target({
                name: 'character',
                cardType: CardType.Character,
                controller: Players.Opponent,
                cardCondition: card => card.isParticipating() && !card.bowed
            })
            .select({
                name: 'select',
                dependsOn: 'character',
                player: Players.Opponent
            }, {
                'Remove a fate from this character': removeFate(context => ({ target: context.targets.character })),
                'Bow this character': bow(context => ({ target: context.targets.character }))
            });
    }
}


export default RelentlessInquisitor;
