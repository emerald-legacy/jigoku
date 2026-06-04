import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Duration } from '../../Constants.js';

class EsteemedTeaHouse extends DrawCard {
    static id = 'esteemed-tea-house';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Return attachment to owners hand',
            condition: context => context.player.anyCardsInPlay((card) => card.isParticipating() && card.hasTrait('courtier')),
            target: {
                cardType: CardType.Attachment,
                cardCondition: card => card.parent && card.parent.type === CardType.Character && card.parent.isParticipating(),
                gameAction: AbilityDsl.actions.returnToHand()
            },
            gameAction: AbilityDsl.actions.playerLastingEffect<DrawCard>(context => ({
                duration: Duration.UntilEndOfPhase,
                targetController: context.target?.owner,
                effect: AbilityDsl.effects.playerCannot({
                    cannot: 'play',
                    restricts: 'copiesOfX',
                    params: context.target?.name
                })
            })),
            effect: 'return {0} to {1}\'s hand and prevent them from playing copies this phase',
            effectArgs: context => [context.target?.owner ?? '']
        });
    }
}

export default EsteemedTeaHouse;
