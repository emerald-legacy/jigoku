import { Phases, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { playerDelayedEffect, refillProvinceTo } from '../../effects.js';
import { fillProvince } from '../../GameActions/GameActions.js';

export default class CityOfTheRichFrog extends ProvinceCard {
    static id = 'city-of-the-rich-frog';

    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.currentPhase !== Phases.Setup,
            effect: refillProvinceTo(3)
        });

        this.persistentEffect({
            targetController: Players.Self,
            effect: playerDelayedEffect({
                when: {
                    onPhaseEnded: (event) => event.phase === Phases.Setup
                },
                message: '{0} fills to 3 cards',
                messageArgs: (effectContext) => [effectContext.source],
                gameAction: fillProvince((context) => ({
                    location: context.source.location,
                    fillTo: 3
                }))
            })
        });
    }
}
