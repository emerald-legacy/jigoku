import AbilityDsl from '../../../abilitydsl.js';
import type BaseCard from '../../../BaseCard.js';
import { CardType, EventName } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';

export default class CraneIndustry extends DrawCard {
    static id = 'crane-industry';

    private eventRegistrar?: EventRegistrar;
    private eventsPlayedThisConflictByThisPlayer = new Set<string>();

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onConflictFinished', 'onCardPlayed']);
        this.reaction('Reduce the cost to play events')
            .when({
                onConflictStarted: () => true
            })
            .gameAction(AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                effect: AbilityDsl.effects.reduceCost({
                    amount: 1,
                    match: (card: BaseCard) => !this.hasEventBeenPlayedByThisPlayer(card)
                })
            })))
            .effect('reduce the cost of the first copy of each event they play this conflict by 1')
            .max(AbilityDsl.limit.perConflict(1));
    }

    public onConflictFinished() {
        this.eventsPlayedThisConflictByThisPlayer.clear();
    }

    public onCardPlayed(event: EventPayload<EventName.OnCardPlayed>) {
        if(event.card.type === CardType.Event && event.context?.player === this.controller) {
            this.eventsPlayedThisConflictByThisPlayer.add(event.card.name);
        }
    }

    private hasEventBeenPlayedByThisPlayer(card: BaseCard) {
        return this.eventsPlayedThisConflictByThisPlayer.has(card.name);
    }
}
