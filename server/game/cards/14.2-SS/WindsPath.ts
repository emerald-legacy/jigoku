import { CardTypes, Locations } from '../../Constants.js';
import { PlayCharacterAsIfFromHandIntoConflict } from '../../PlayCharacterAsIfFromHand.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class WindsPath extends ProvinceCard {
    static id = 'wind-s-path';

    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.game.isDuringConflict(),
            targetLocation: Locations.Provinces,
            match: (card: any, context: any) =>
                card.type === CardTypes.Character && card.location === context?.source.location && card.isFaceup(),
            effect: [AbilityDsl.effects.gainPlayAction(PlayCharacterAsIfFromHandIntoConflict)]
        });
    }
}
