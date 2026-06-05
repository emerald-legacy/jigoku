import { Location } from '../../Constants.js';
import { PlayCharacterAsIfFromHand } from '../../PlayCharacterAsIfFromHand.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class DaidojiUji extends DrawCard {
    static id = 'daidoji-uji';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isHonored,
            targetLocation: Location.Provinces,
            match: (card: DrawCard) => card.isDynasty && card.isFaceup(),
            effect: AbilityDsl.effects.gainPlayAction(PlayCharacterAsIfFromHand)
        });
    }
}
