import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Location } from '../../Constants.js';

class MushinNoShin extends DrawCard {
    static id = 'mushin-no-shin';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel an ability')
            .when({
                onInitiateAbilityEffects: (event, context) =>
                    event.context.ability.isTriggeredAbility() &&
                    (event.cardTargets ?? []).some(
                        (card) =>
                            card.type === CardType.Character &&
                            card.location === Location.PlayArea &&
                            card.controller === context.player &&
                            card.attachments.length >= 2
                    )
            })
            .gameAction(AbilityDsl.actions.cancel());
    }
}


export default MushinNoShin;
