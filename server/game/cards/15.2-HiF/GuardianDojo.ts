import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations, CharacterStatus, CardTypes } from '../../Constants.js';

class GuardianDojo extends DrawCard {
    static id = 'guardian-dojo';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Locations.Any,
            match: (card: any, context: any) => card.type === CardTypes.Character
                && card.isFaceup()
                && context.player.areLocationsAdjacent(context.source.location, card.location),
            effect: [
                AbilityDsl.effects.entersPlayWithStatus(CharacterStatus.Honored)
            ]
        });

        this.persistentEffect({
            targetLocation: Locations.Any,
            effect: AbilityDsl.effects.playerCannot({
                cannot: 'placeFateWhenPlayingCharacterFromProvince',
                restricts: 'adjacentCharacters'
            })
        });
    }
}


export default GuardianDojo;
