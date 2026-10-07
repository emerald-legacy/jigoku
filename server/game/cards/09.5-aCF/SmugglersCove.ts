import { CardType, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';

export default class SmugglersCove extends ProvinceCard {
    static id = 'smuggler-s-cove';

    setupCardAbilities() {
        this.action('Moves a character to or from a conflict at this province')
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            })
            .if((context) => context.target.isParticipating())
                .sendHome()
            .otherwise()
                .moveToConflict();
    }
}
