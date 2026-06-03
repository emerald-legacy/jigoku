import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

export default class Pressure extends DrawCard {
    static id = 'pressure';

    setupCardAbilities() {
        this.reaction({
            title: 'Move home a character',
            max: AbilityDsl.limit.perConflict(1),
            when: {
                onConflictDeclared: (_event, _context) => true,
                onDefendersDeclared: (_event, _context) => true,
                onMoveToConflict: (_event, _context) => true
            },
            gameAction: AbilityDsl.actions.selectCard(context => ({
                activePromptTitle: 'Choose a character',
                cardType: CardType.Character,
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
