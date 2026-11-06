import { CardType, Location } from '../../Constants.js';
import { PlayCharacterAsIfFromHand } from '../../PlayCharacterAsIfFromHand.js';
import { PlayIntoLocation } from '../../PlayCharacterAction.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { gainPlayAction } from '../../effects.js';

export default class WindsPath extends ProvinceCard {
    static id = 'wind-s-path';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.game.isDuringConflict(),
            targetLocation: Location.Provinces,
            match: (card, context) =>
                card.type === CardType.Character && card.location === context?.source.location && card.isFaceup(),
            effect: [gainPlayAction((card) => new PlayCharacterAsIfFromHand(card, { into: PlayIntoLocation.Conflict }))]
        });
    }
}
