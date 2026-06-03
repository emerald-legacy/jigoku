import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class TryAgainTomorrow extends DrawCard {
    static id = 'try-again-tomorrow';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Send a Character home',
            condition: (context: AbilityContext) =>
                context.player.anyCardsInPlay((card: any) => card.isParticipating() &&
                card.hasTrait('courtier') && card.isHonored),
            cannotBeMirrored: true,
            target: {
                cardType: CardType.Character,
                cardCondition: (card: any) => card.isAttacking(),
                gameAction: ability.actions.sendHome()
            }
        });
    }
}


export default TryAgainTomorrow;
