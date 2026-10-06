import { CardType, Location, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { addTrait } from '../../effects.js';
import { moveConflict } from '../../GameActions/GameActions.js';

export default class GoldenPlains extends ProvinceCard {
    static id = 'golden-plains';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => card.controller === context?.player && card.location === Location.PlayArea,
            targetController: Players.Self,
            effect: addTrait('cavalry'),
            condition: (context) => context.player.stronghold?.name === 'Golden Plains Outpost'
        });

        this.reaction('Move the conflict')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            })
            .target({
                cardType: CardType.Province,
                location: Location.Provinces
            }, moveConflict());
    }
}
