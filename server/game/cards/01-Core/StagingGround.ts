import DrawCard from '../../DrawCard.js';
import { Location, Players, TargetMode } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class StagingGround extends DrawCard {
    static id = 'staging-ground';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Flip up to 2 dynasty cards',
            target: {
                mode: TargetMode.UpTo,
                numCards: 2,
                activePromptTitle: 'Choose up to 2 cards',
                location: Location.Provinces,
                controller: Players.Self,
                gameAction: ability.actions.flipDynasty()
            }
        });
    }
}


export default StagingGround;
