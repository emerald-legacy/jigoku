import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Locations } from '../../Constants.js';

class MushinNoShin extends DrawCard {
    static id = 'mushin-no-shin';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel an ability',
            when: {
                onInitiateAbilityEffects: (event: any, context) =>
                    event.context.ability.isTriggeredAbility() &&
                    (event.cardTargets?.some(
                        (card: any) =>
                            card.attachments.length >= 2 &&
                            card.controller === context.player &&
                            card.location === Locations.PlayArea
                    ) ?? false)
            },
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}


export default MushinNoShin;
