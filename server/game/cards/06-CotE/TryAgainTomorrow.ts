import { sendHome } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Trait } from '../../Constants.js';

class TryAgainTomorrow extends DrawCard {
    static id = 'try-again-tomorrow';

    override setupCardAbilities() {
        this.action('Send a Character home')
            .condition((context) =>
                context.player.anyCardsInPlay((card) => card.isParticipating() &&
                card.hasTrait(Trait.Courtier) && card.isHonored))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, sendHome())
            .cannotBeMirrored();
    }
}


export default TryAgainTomorrow;
