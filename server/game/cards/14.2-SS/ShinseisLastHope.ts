import { PlayType, Location, Players, CardType, CharacterStatus } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { entersPlayWithStatus, reduceCost } from '../../effects.js';

export default class ShinseisLastHope extends ProvinceCard {
    static id = 'shinsei-s-last-hope';

    setupCardAbilities() {
        this.persistentEffect({
            effect: reduceCost({
                amount: 2,
                match: (card, source) => card.location === source.location,
                playingTypes: PlayType.PlayFromProvince
            })
        });

        this.persistentEffect({
            targetLocation: Location.Provinces,
            targetController: Players.Self,
            match: (card, context) => card.type === CardType.Character && card.location === context?.source.location,
            effect: entersPlayWithStatus(CharacterStatus.Dishonored)
        });
    }
}
