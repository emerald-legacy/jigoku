import { Location } from '../../Constants.js';
import { PlayCharacterAsIfFromHand } from '../../PlayCharacterAsIfFromHand.js';
import { PlayIntoLocation } from '../../PlayCharacterAction.js';
import { gainPlayAction } from '../../effects.js';
import { BattlefieldAttachment } from '../BattlefieldAttachment.js';

export default class PreparedAmbush extends BattlefieldAttachment {
    static id = 'prepared-ambush';

    public override setupCardAbilities() {
        super.setupCardAbilities();

        this.persistentEffect({
            condition: (context) =>
                !!(context.game.isDuringConflict() && context.source.parentProvince?.isConflictProvince()),
            targetLocation: Location.Provinces,
            match: (card) => card.isDynasty && card.isFaceup(),
            effect: gainPlayAction((card) => new PlayCharacterAsIfFromHand(card, { into: PlayIntoLocation.Conflict }))
        });
    }
}
