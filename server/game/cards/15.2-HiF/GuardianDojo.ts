import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, CharacterStatus, CardType } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';

class GuardianDojo extends DrawCard {
    static id = 'guardian-dojo';

    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Location.Any,
            match: (card: DrawCard, context?: AbilityContext) => card.type === CardType.Character
                && card.isFaceup()
                && !!context && context.player.areLocationsAdjacent(context.source.location, card.location),
            effect: [
                AbilityDsl.effects.entersPlayWithStatus(CharacterStatus.Honored)
            ]
        });

        this.persistentEffect({
            targetLocation: Location.Any,
            effect: AbilityDsl.effects.playerCannot({
                cannot: 'placeFateWhenPlayingCharacterFromProvince',
                restricts: 'adjacentCharacters'
            })
        });
    }
}


export default GuardianDojo;
