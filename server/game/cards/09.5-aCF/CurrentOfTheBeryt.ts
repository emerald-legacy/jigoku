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

        this.action({
            title: 'Take two actions',
            condition: () => this.game.isDuringConflict(),
            effect: 'take two actions',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                duration: Duration.UntilPassPriority,
                effect: AbilityDsl.effects.additionalAction(2)
            }))
        });
    }
}


export default CurrentOfTheBeryt;
