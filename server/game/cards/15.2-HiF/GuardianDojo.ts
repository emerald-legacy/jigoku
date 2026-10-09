import DrawCard from '../../DrawCard.js';
import { entersPlayWithStatus, playerCannot } from '../../effects.js';
import { Location, CharacterStatus, CardType, RestrictionType } from '../../Constants.js';

class GuardianDojo extends DrawCard {
    static id = 'guardian-dojo';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Any,
            match: (card, context) => card.type === CardType.Character
                && card.isFaceup()
                && !!context && context.player.areLocationsAdjacent(context.source.location, card.location),
            effect: [
                entersPlayWithStatus(CharacterStatus.Honored)
            ]
        });

        this.persistentEffect({
            targetLocation: Location.Any,
            effect: playerCannot({
                cannot: RestrictionType.PlaceFateWhenPlayingCharacterFromProvince,
                restricts: 'adjacentCharacters'
            })
        });
    }
}


export default GuardianDojo;
