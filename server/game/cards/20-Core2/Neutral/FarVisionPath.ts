import { CardType, Location, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class FarVisionPath extends ProvinceCard {
    static id = 'far-vision-path';

    public setupCardAbilities() {
        this.reaction('Move the conflict')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .target('target', {
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Self
            }, AbilityDsl.actions.moveConflict());
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}
