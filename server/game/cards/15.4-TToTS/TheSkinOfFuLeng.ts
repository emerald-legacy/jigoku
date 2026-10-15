import DrawCard from '../../DrawCard.js';
import { Players, RestrictionType, RestrictionScope } from '../../Constants.js';
import { canBeTriggeredByOpponent, playerCannot } from '../../effects.js';

class TheSkinOfFuLeng extends DrawCard {
    static id = 'the-skin-of-fu-leng';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true
        });

        this.persistentEffect({
            targetController: Players.Opponent,
            effect: playerCannot({
                cannot: RestrictionType.TriggerAbilities,
                appliesTo: [RestrictionScope.CharactersWithNoFate, RestrictionScope.NonForcedAbilities]
            })
        });

        this.persistentEffect({
            match: (card) => card.getFate() === 0,
            targetController: Players.Opponent,
            effect: canBeTriggeredByOpponent()
        });
    }
}


export default TheSkinOfFuLeng;
