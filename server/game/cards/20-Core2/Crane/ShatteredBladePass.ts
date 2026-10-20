import { CardType, Players, Duration } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import { additionalAction } from '../../../effects.js';
import { moveToConflict, multiple, ready } from '../../../GameActions/GameActions.js';

export default class ShatteredBladePass extends ProvinceCard {
    static id = 'shattered-blade-pass';

    public override setupCardAbilities() {
        this.action('Ready a character and move it to the conflict')
            .condition((context) => !context.player.cardsInPlay.some((card) => card.isParticipating()))
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, multiple([
                ready(),
                moveToConflict()
            ]))
            .chatText('ready {0} and move it into the conflict, taking an additional action')
            .afterwards()
            .playerLastingEffect({
                target: Players.Self,
                duration: Duration.UntilPassPriority,
                effect: additionalAction()
            });
    }
}
