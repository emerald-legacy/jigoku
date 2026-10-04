import { CardType, Players, ConflictType } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class Pressure extends DrawCard {
    static id = 'pressure';

    setupCardAbilities() {
        this.reaction('Move home a character')
            .when({
                onConflictDeclared: (_event, _context) => true,
                onDefendersDeclared: (_event, _context) => true,
                onMoveToConflict: (_event, _context) => true
            })
            .gameAction(AbilityDsl.actions.selectCard(context => ({
                activePromptTitle: 'Choose a character',
                cardType: CardType.Character,
                controller: Players.Opponent,
                targets: false,
                hidePromptIfSingleCard: true,
                cardCondition: (card, context) => card.isCharacter() && card.isDishonored && card.isParticipating() && (
                    context.event.attackers?.includes(card) ||
                    context.event.defenders?.includes(card) ||
                    context.event.card === card
                ),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.sendHome(),
                    AbilityDsl.actions.cardLastingEffect({
                        effect: [
                            AbilityDsl.effects.cannotParticipateAsAttacker(ConflictType.Military),
                            AbilityDsl.effects.cannotParticipateAsDefender(ConflictType.Military)
                        ]
                    })
                ]),
                message: '{0} chooses {1}',
                messageArgs: (cards) => [context.player, cards]
            })))
            .effect('move a character home and prevent it from participating in the conflict')
            .max(AbilityDsl.limit.perConflict(1));
    }
}
