import { Players, Phases } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class CityOfTheRichFrog extends ProvinceCard {
    static id = 'city-of-the-rich-frog';

    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.currentPhase !== 'setup',
            effect: AbilityDsl.effects.refillProvinceTo(3)
        });

        this.persistentEffect({
            targetController: Players.Self,
            effect: AbilityDsl.effects.playerDelayedEffect({
                when: {
                    onPhaseEnded: (event: any) => event.phase === Phases.Setup
                },
                message: '{0} fills to 3 cards!',
                messageArgs: (effectContext: any) => [effectContext.source],
                gameAction: AbilityDsl.actions.fillProvince((context) => ({
                    location: context.source.location,
                    fillTo: 3
                }))
            })
        });
    }
}
