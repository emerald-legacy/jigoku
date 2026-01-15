import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext';

export default class Pressure extends DrawCard {
    static id = 'pressure';

    setupCardAbilities() {
        this.reaction({
            title: 'Move home a character',
            when: {
                onConflictDeclared: (event, context) => true,
                onDefendersDeclared: (event, context) => true,
                onMoveToConflict: (event, context) => true
            },
            gameAction: AbilityDsl.actions.selectCard(context => ({
                activePromptTitle: 'Choose a character',
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                targets: false,
                hidePromptIfSingleCard: true,
                cardCondition: (card, context) => card.isDishonored && card.isParticipating() && (
                    (context as TriggeredAbilityContext).event.attackers?.includes(card) ||
                    (context as TriggeredAbilityContext).event.defenders?.includes(card) ||
                    (context as TriggeredAbilityContext).event?.card === card
                ),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.sendHome(),
                    AbilityDsl.actions.cardLastingEffect({
                        effect: [
                            AbilityDsl.effects.cannotParticipateAsAttacker('military'),
                            AbilityDsl.effects.cannotParticipateAsDefender('military')
                        ]
                    })
                ]),
                message: '{0} chooses {1}',
                messageArgs: (cards) => [context.player, cards]
            })),
            effect: 'move a character home and prevent it from participating in the conflict'
        });
    }
}
