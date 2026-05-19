import DrawCard from '../../drawcard.js';
import { Durations } from '../../Constants.js';

class CurrentOfTheBeryt extends DrawCard {
    static id = 'current-of-the-beryt';

    setupCardAbilities(ability) {
        this.attachmentConditions({
            myControl: true,
            trait: 'shugenja'
        });

        this.action({
            title: 'Take two actions',
            condition: () => this.game.isDuringConflict(),
            effect: 'take two actions',
            gameAction: ability.actions.playerLastingEffect(context => ({
                targetController: context.player,
                duration: Durations.UntilPassPriority,
                effect: ability.effects.additionalAction(2)
            }))
        });
    }
}


export default CurrentOfTheBeryt;
