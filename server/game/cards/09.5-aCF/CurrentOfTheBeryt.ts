import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Duration } from '../../Constants.js';

class CurrentOfTheBeryt extends DrawCard {
    static id = 'current-of-the-beryt';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            trait: 'shugenja'
        });

        this.action('Take two actions')
            .condition(() => this.game.isDuringConflict())
            .gameAction(AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                duration: Duration.UntilPassPriority,
                effect: AbilityDsl.effects.additionalAction(2)
            })))
            .effect('take two actions');
    }
}


export default CurrentOfTheBeryt;
