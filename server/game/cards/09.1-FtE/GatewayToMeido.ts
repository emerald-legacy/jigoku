import { Locations, CardTypes } from '../../Constants.js';
import { PlayCharacterAsIfFromHandIntoConflict } from '../../PlayCharacterAsIfFromHand.js';
import { PlayDisguisedCharacterAsIfFromHandIntoConflict } from '../../PlayDisguisedCharacterAsIfFromHand.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class GatewayToMeido extends ProvinceCard {
    static id = 'gateway-to-meido';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isConflictProvince(),
            targetLocation: Locations.DynastyDiscardPile,
            match: (card) => card.type === CardTypes.Character,
            effect: [
                AbilityDsl.effects.gainPlayAction(PlayCharacterAsIfFromHandIntoConflict),
                AbilityDsl.effects.gainPlayAction(PlayDisguisedCharacterAsIfFromHandIntoConflict)
            ]
        });
    }

    public cannotBeStrongholdProvince() {
        return true;
    }
}
