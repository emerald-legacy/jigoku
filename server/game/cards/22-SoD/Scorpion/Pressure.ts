import { CardType, Players, ConflictType } from '../../../Constants.js';
import { perConflict } from '../../../AbilityLimit.js';
import { cannotParticipateAsAttacker, cannotParticipateAsDefender } from '../../../effects.js';
import { cardLastingEffect, multiple, sendHome } from '../../../GameActions/GameActions.js';
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
            .selectCard((context) => ({
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
                gameAction: multiple([
                    sendHome(),
                    cardLastingEffect({
                        effect: [
                            cannotParticipateAsAttacker(ConflictType.Military),
                            cannotParticipateAsDefender(ConflictType.Military)
                        ]
                    })
                ]),
                message: '{0} chooses {1}',
                messageArgs: (cards) => [context.player, cards]
            }))
            .chatText('move a character home and prevent it from participating in the conflict')
            .max(perConflict(1));
    }
}
