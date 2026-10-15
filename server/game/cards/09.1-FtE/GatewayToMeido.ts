import { Location, CardType } from '../../Constants.js';
import { PlayCharacterAsIfFromHandIntoConflict } from '../../PlayCharacterAsIfFromHand.js';
import { PlayDisguisedCharacterAsIfFromHandIntoConflict } from '../../PlayDisguisedCharacterAsIfFromHand.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { gainPlayAction } from '../../effects.js';

export default class GatewayToMeido extends ProvinceCard {
    static id = 'gateway-to-meido';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            targetLocation: Location.DynastyDiscardPile,
            match: (card) => card.type === CardType.Character,
            effect: [
                gainPlayAction(PlayCharacterAsIfFromHandIntoConflict),
                gainPlayAction(PlayDisguisedCharacterAsIfFromHandIntoConflict)
            ]
        });
    }

    public cannotBeStrongholdProvince() {
        return true;
    }
}
