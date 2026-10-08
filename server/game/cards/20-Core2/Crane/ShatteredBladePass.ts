import { CardType, Players, Duration } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { additionalAction } from '../../../effects.js';
import { moveToConflict, multiple, playerLastingEffect, ready } from '../../../GameActions/GameActions.js';

export default class ShatteredBladePass extends ProvinceCard {
    static id = 'shattered-blade-pass';

    public setupCardAbilities() {
        this.action('Ready a character and move it to the conflict')
            .condition((context) => context.game.currentConflict !== null && context.game.currentConflict.defenders.length === 0)
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, multiple([
                ready(),
                moveToConflict(),
                playerLastingEffect((context) => ({
                    targetController: context.player,
                    duration: Duration.UntilPassPriority,
                    effect: additionalAction()
                }))
            ]))
            .chatText('ready {0} and move it into the conflict, taking an additional action');
    }
}
