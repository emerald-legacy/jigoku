import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { CardType, CharacterStatus, Players, Trait } from '../../Constants.js';
import { removeFromGame } from '../../GameActions/GameActions.js';

class ShadowStep extends DrawCard {
    static id = 'shadow-step';

    override setupCardAbilities() {
        this.action('Remove a character from the game and put it into play')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => !card.hasTrait(Trait.Mythic),
                controller: Players.Self
            }, removeFromGame((context) => ({
                target: context.target
            })))
            .chatText('remove {0} from the game, then put it back into play')
            .afterwards()
            .if((context) => !!context.target?.hasTrait(Trait.Shadow))
            .putIntoPlay((context) => ({ target: context.target, controller: this.ownerSide(context) }))
            .otherwise()
            .putIntoPlay((context) => ({ target: context.target, status: CharacterStatus.Dishonored, controller: this.ownerSide(context) }));
    }

    /** It enters play under its owner's control, also after you took control of it (EmeraldDB ruling). */
    private ownerSide(context: AbilityContext): Players {
        return context.target?.owner === context.player ? Players.Self : Players.Opponent;
    }
}


export default ShadowStep;
