import { PlayType, Location, Players, CardType, CharacterStatus } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class ShinseisLastHope extends ProvinceCard {
    static id = 'shinsei-s-last-hope';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.reduceCost({
                amount: 2,
                match: (card: any, source: any) => card.location === source.location,
                playingTypes: PlayType.PlayFromProvince
            })
        });

        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            match: (card, context) => card.type === CardType.Character && card.location === context?.source.location,
            effect: AbilityDsl.effects.entersPlayWithStatus(CharacterStatus.Dishonored)
        });
    }
}
