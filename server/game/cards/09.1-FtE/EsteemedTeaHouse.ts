import DrawCard from '../../drawcard';
import AbilityDsl from '../../abilitydsl';
import { CardTypes, Durations } from '../../Constants';

class EsteemedTeaHouse extends DrawCard {
    static id = 'esteemed-tea-house';

    setupCardAbilities() {
        this.action({
            title: 'Return attachment to owners hand',
            condition: context => context.player.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('courtier')),
            target: {
                cardType: CardTypes.Attachment,
                cardCondition: card => card.parent && card.parent.type === CardTypes.Character && card.parent.isParticipating(),
                gameAction: AbilityDsl.actions.returnToHand()
            },
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                duration: Durations.UntilEndOfPhase,
                targetController: context.target.owner,
                effect: AbilityDsl.effects.playerCannot({
                    cannot: 'play',
                    restricts: 'copiesOfX',
                    params: context.target.name
                })
            })),
            effect: 'return {0} to {1}\'s hand and prevent them from playing copies this phase',
            effectArgs: context => [context.target.owner]
        });
    }
}

export default EsteemedTeaHouse;
