import { Locations, Players, CardTypes } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class GoldenPlains extends ProvinceCard {
    static id = 'golden-plains';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => card.controller === context.player && card.location === Locations.PlayArea,
            targetController: Players.Self,
            effect: AbilityDsl.effects.addTrait('cavalry'),
            condition: (context) => context.player.stronghold.name === 'Golden Plains Outpost'
        });

        this.reaction({
            title: 'Move the conflict',
            when: {
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            },
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                gameAction: AbilityDsl.actions.moveConflict()
            }
        });
    }
}
