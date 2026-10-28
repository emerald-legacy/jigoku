import { perConflict } from '../../../AbilityLimit.js';
import { reduceCost } from '../../../effects.js';
import type BaseCard from '../../../BaseCard.js';
import { CardType, EventName } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';
import type Player from '../../../Player.js';

export default class CraneIndustry extends DrawCard {
    static id = 'crane-industry';

    // per player: a copy (The Mirror's Gaze) reduces the events its own player plays
    private eventsPlayedThisConflict = new Map<Player, Set<string>>();

    public override setupCardAbilities() {
        new EventRegistrar(this.game).register({
            [EventName.OnConflictFinished]: () => this.onConflictFinished(),
            [EventName.OnCardPlayed]: (event) => this.onCardPlayed(event)
        });
        this.reaction('Reduce the cost to play events')
            .when({
                onConflictStarted: () => true
            })
            .playerLastingEffect((context) => ({
                effect: reduceCost({
                    amount: 1,
                    match: (card) => card.type === CardType.Event && !this.hasEventBeenPlayed(context.player, card)
                })
            }))
            .chatText('reduce the cost of the first copy of each event they play this conflict by 1')
            .max(perConflict(1));
    }

    public onConflictFinished() {
        this.eventsPlayedThisConflict.clear();
    }

    public onCardPlayed(event: EventPayload<EventName.OnCardPlayed>) {
        const player = event.context?.player;
        if(event.card.type === CardType.Event && player && this.game.isDuringConflict()) {
            const names = this.eventsPlayedThisConflict.get(player) ?? new Set<string>();
            names.add(event.card.name);
            this.eventsPlayedThisConflict.set(player, names);
        }
    }

    private hasEventBeenPlayed(player: Player, card: BaseCard) {
        return !!this.eventsPlayedThisConflict.get(player)?.has(card.name);
    }
}
