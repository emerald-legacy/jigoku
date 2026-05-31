import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardTypes } from '../../Constants.js';

class TryAgainTomorrow extends DrawCard {
    static id = 'try-again-tomorrow';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Send a Character home',
            condition: (context: any) =>
                context.player.anyCardsInPlay((card: any) => card.isParticipating() &&
                card.hasTrait('courtier') && card.isHonored),
            cannotBeMirrored: true,
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card: any) => card.isAttacking(),
                gameAction: ability.actions.sendHome()
            }
        });
    }
}


export default TryAgainTomorrow;
