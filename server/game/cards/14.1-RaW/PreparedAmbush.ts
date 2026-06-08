import { Location } from '../../Constants.js';
import { PlayCharacterAsIfFromHandIntoConflict } from '../../PlayCharacterAsIfFromHand.js';
import AbilityDsl from '../../abilitydsl.js';
import { BattlefieldAttachment } from '../BattlefieldAttachment.js';
import DrawCard from '../../DrawCard.js';

export default class PreparedAmbush extends BattlefieldAttachment {
    static id = 'prepared-ambush';

    public setupCardAbilities() {
        super.setupCardAbilities();

        this.persistentEffect({
            condition: (context) =>
                !!(context.source.parent && context.game.isDuringConflict() && context.source.parent.isConflictProvince()),
            targetLocation: Location.Provinces,
            match: (card: DrawCard) => card.isDynasty && card.isFaceup(),
            effect: AbilityDsl.effects.gainPlayAction(PlayCharacterAsIfFromHandIntoConflict)
        });
    }
}
