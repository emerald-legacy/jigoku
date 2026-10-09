import { msg } from '../../GameChat.js';
import { Phase, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { playerDelayedEffect, refillProvinceTo } from '../../effects.js';
import { fillProvince } from '../../GameActions/GameActions.js';

export default class CityOfTheRichFrog extends ProvinceCard {
    static id = 'city-of-the-rich-frog';

    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.currentPhase !== Phase.Setup,
            effect: refillProvinceTo(3)
        });

        this.persistentEffect({
            targetController: Players.Self,
            effect: playerDelayedEffect({
                when: {
                    onPhaseEnded: (event) => event.phase === Phase.Setup
                },
                message: (effectContext) => msg`${effectContext.source} fills to 3 cards`,
                gameAction: fillProvince((context) => ({
                    location: context.source.location,
                    fillTo: 3
                }))
            })
        });
    }
}
