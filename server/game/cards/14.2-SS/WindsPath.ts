import { CardType, Location } from '../../Constants.js';
import { PlayCharacterAsIfFromHandIntoConflict } from '../../PlayCharacterAsIfFromHand.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class WindsPath extends ProvinceCard {
    static id = 'wind-s-path';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.game.isDuringConflict(),
            targetLocation: Location.Provinces,
            match: (card, context) =>
                card.type === CardType.Character && card.location === context?.source.location && card.isFaceup(),
            effect: [AbilityDsl.effects.gainPlayAction(PlayCharacterAsIfFromHandIntoConflict)]
        });
    }
}
