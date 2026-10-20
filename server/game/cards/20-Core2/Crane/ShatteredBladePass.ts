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
                controller: Players.Self,
                cardCondition: (card, context) => moveToConflict().canAffect(card, context)
            }, multiple([
                ready(),
                moveToConflict()
            ]))
            .chatText('ready {0} and move it into the conflict, taking an additional action')
            // readied or moved in (or both)
            .afterwardsIf((context) => context.events.some((event) => event.isFullyResolved()))
            .playerLastingEffect({
                target: Players.Self,
                duration: Duration.UntilPassPriority,
                effect: additionalAction()
            });
    }
}
