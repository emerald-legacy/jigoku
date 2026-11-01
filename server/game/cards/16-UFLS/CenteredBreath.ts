import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Duration, Players, CardType, Trait } from '../../Constants.js';
import { additionalAction, increaseLimitOnPrintedAbilities } from '../../effects.js';
import { cardLastingEffect, playerLastingEffect, sequential } from '../../GameActions/GameActions.js';

class CenteredBreath extends DrawCard {
    static id = 'centered-breath';

    override setupCardAbilities() {
        this.action('Add an additional ability use to a monk')
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.hasTrait(Trait.Monk) && card.isParticipating()
            }, sequential([
                cardLastingEffect({
                    duration: Duration.UntilEndOfRound,
                    effect: increaseLimitOnPrintedAbilities()
                }),
                playerLastingEffect((context) => ({
                    target: Players.Self,
                    duration: Duration.UntilPassPriority,
                    effect: context.player.isKihoPlayedThisConflict(context, this) ? additionalAction() : []
                }))
            ]))
            .chatText((context) => msg`add an additional use to each of ${context.chatTarget()}'s printed abilities${context.player.isKihoPlayedThisConflict(context, this) ? ' and take an additional action' : ''}`);
    }
}


export default CenteredBreath;
