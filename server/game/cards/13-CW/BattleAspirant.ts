import DrawCard from '../../DrawCard.js';
import { CardType, Duration, EventName, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class BattleAspirant extends DrawCard {
    static id = 'battle-aspirant';

    setupCardAbilities() {
        this.reaction({
            title: 'Force a character to defend',
            when: {
                onConflictDeclared: (event: EventPayload<EventName.OnConflictDeclared>, context) => event.attackers?.includes(context.source) && this.game.currentConflict?.conflictType === 'military'
            },
            target: {
                controller: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: card => !card.hasKeyword('covert'),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Duration.UntilEndOfConflict,
                    effect: AbilityDsl.effects.mustBeDeclaredAsDefender()
                })
            },
            effect: 'force {0} to declare as a defender this conflict'
        });
    }
}


export default BattleAspirant;
