import { addTrait } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { ConflictType, Trait } from '../../Constants.js';

class UtakuBattleSteed extends DrawCard {
    static id = 'utaku-battle-steed';

    override setupCardAbilities() {
        this.attachmentConditions({
            faction: 'unicorn'
        });

        this.whileAttached({
            effect: addTrait(Trait.Cavalry)
        });

        this.reaction('Honor attached character')
            .when({
                afterConflict: (event, context) => !!context.source.parentCharacter && event.conflict.isOnWinningSide(context.source.parentCharacter) &&
                                                   event.conflict.conflictType === ConflictType.Military
            })
            .honor((context) => ({
                target: context.source.parentCharacter ?? []
            }));
    }
}


export default UtakuBattleSteed;
