import DrawCard from '../../drawcard.js';
import { Locations, Players, TargetModes } from '../../Constants.js';

class StagingGround extends DrawCard {
    static id = 'staging-ground';

    setupCardAbilities(ability) {
        this.action({
            title: 'Flip up to 2 dynasty cards',
            target: {
                mode: TargetModes.UpTo,
                numCards: 2,
                activePromptTitle: 'Choose up to 2 cards',
                location: Locations.Provinces,
                controller: Players.Self,
                gameAction: ability.actions.flipDynasty()
            }
        });
    }
}


export default StagingGround;
