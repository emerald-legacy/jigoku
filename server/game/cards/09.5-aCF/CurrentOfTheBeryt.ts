import { additionalAction } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { Duration, Trait } from '../../Constants.js';

class CurrentOfTheBeryt extends DrawCard {
    static id = 'current-of-the-beryt';

    override setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            trait: Trait.Shugenja
        });

        this.action('Take two actions')
            .condition(() => this.game.isDuringConflict())
            .playerLastingEffect({
                duration: Duration.UntilPassPriority,
                effect: additionalAction(2)
            })
            .chatText('take two actions');
    }
}


export default CurrentOfTheBeryt;
