import { Location, CardType } from '../../Constants.js';
import { PlayCharacterAsIfFromHand } from '../../PlayCharacterAsIfFromHand.js';
import { PlayIntoLocation } from '../../PlayCharacterAction.js';
import { PlayDisguisedCharacterAsIfFromHand } from '../../PlayDisguisedCharacterAsIfFromHand.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { gainPlayAction } from '../../effects.js';

export default class GatewayToMeido extends ProvinceCard {
    static id = 'gateway-to-meido';

    public override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            targetLocation: Location.DynastyDiscardPile,
            match: (card) => card.type === CardType.Character,
            effect: [
                gainPlayAction((card) => new PlayCharacterAsIfFromHand(card, { into: PlayIntoLocation.Conflict })),
                gainPlayAction((card) => new PlayDisguisedCharacterAsIfFromHand(card, { into: PlayIntoLocation.Conflict }))
            ]
        });
    }

    public override cannotBeStrongholdProvince() {
        return true;
    }
}
