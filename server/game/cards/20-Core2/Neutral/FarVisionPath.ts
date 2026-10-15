import { CardType, Location, Players } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { moveConflict } from '../../../GameActions/GameActions.js';

export default class FarVisionPath extends ProvinceCard {
    static id = 'far-vision-path';

    public override setupCardAbilities() {
        this.reaction('Move the conflict')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Province,
                location: Location.Provinces,
                controller: Players.Self
            }, moveConflict());
    }

    override cannotBeStrongholdProvince() {
        return true;
    }
}
