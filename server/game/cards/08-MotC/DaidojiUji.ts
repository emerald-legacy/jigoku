import { Location } from '../../Constants.js';
import { PlayCharacterAsIfFromHand } from '../../PlayCharacterAsIfFromHand.js';
import { gainPlayAction } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class DaidojiUji extends DrawCard {
    static id = 'daidoji-uji';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isHonored,
            targetLocation: Location.Provinces,
            match: (card) => card.isDynasty && card.isFaceup(),
            effect: gainPlayAction(PlayCharacterAsIfFromHand)
        });
    }
}
