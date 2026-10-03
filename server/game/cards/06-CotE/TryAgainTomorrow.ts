import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class TryAgainTomorrow extends DrawCard {
    static id = 'try-again-tomorrow';

    setupCardAbilities() {
        this.action('Send a Character home')
            .condition((context) =>
                context.player.anyCardsInPlay((card) => card.isParticipating() &&
                card.hasTrait('courtier') && card.isHonored))
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, AbilityDsl.actions.sendHome())
            .cannotBeMirrored();
    }
}


export default TryAgainTomorrow;
