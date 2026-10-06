import DrawCard from '../../DrawCard.js';
import { Location, Players, TargetMode } from '../../Constants.js';
import { flipDynasty } from '../../GameActions/GameActions.js';

class StagingGround extends DrawCard {
    static id = 'staging-ground';

    setupCardAbilities() {
        this.action('Flip up to 2 dynasty cards')
            .targetCards({
                mode: TargetMode.UpTo,
                numCards: 2,
                activePromptTitle: 'Choose up to 2 cards',
                location: Location.Provinces,
                controller: Players.Self
            }, flipDynasty());
    }
}


export default StagingGround;
