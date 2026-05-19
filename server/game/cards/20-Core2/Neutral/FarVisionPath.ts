import { CardTypes, Locations, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class FarVisionPath extends ProvinceCard {
    static id = 'far-vision-path';

    public setupCardAbilities() {
        this.reaction({
            title: 'Move the conflict',
            when: {
                onCardRevealed: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.moveConflict()
            }
        });
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}
