import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { playerCannot } from '../../effects.js';
import { returnToHand } from '../../GameActions/GameActions.js';
import { CardType, Duration } from '../../Constants.js';

class EsteemedTeaHouse extends DrawCard {
    static id = 'esteemed-tea-house';

    setupCardAbilities() {
        this.action('Return attachment to owners hand')
            .condition((context) => context.player.anyCardsInPlay((card) => card.isParticipating() && card.hasTrait('courtier')))
            .target({
                cardType: CardType.Attachment,
                cardCondition: (card) => Boolean(card.parentCharacter?.isParticipating())
            }, returnToHand())
            .playerLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                targetController: context.target?.owner,
                effect: playerCannot({
                    cannot: 'play',
                    restricts: 'copiesOfX',
                    params: context.target?.name
                })
            }))
            .chatText((context) => msg`return ${context.chatTarget()} to ${context.target.owner}'s hand and prevent them from playing copies this phase`);
    }
}

export default EsteemedTeaHouse;
