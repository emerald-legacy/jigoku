import { CardType, EventName, Location, Phases } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import AbilityDsl from '../../abilitydsl.js';
import BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import type { EventPayload } from '../../Events/EventPayloads.js';

export default class SoshiShadowshaper extends DrawCard {
    static id = 'soshi-shadowshaper';

    private charactersPlayedThisPhase = new Set<BaseCard>();
    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventName.OnPhaseStarted, EventName.OnCharacterEntersPlay]);

        this.action({
            title: 'Return a character to owner\'s hand',
            phase: Phases.Conflict,
            cost: AbilityDsl.costs.payHonor(1),
            target: {
                cardType: CardType.Character,
                cardCondition: (card) => (card.getCost() ?? 0) < 3 && this.charactersPlayedThisPhase.has(card),
                gameAction: AbilityDsl.actions.returnToHand()
            }
        });
    }

    public onPhaseStarted() {
        this.charactersPlayedThisPhase.clear();
    }

    public onCharacterEntersPlay(event: EventPayload<EventName.OnCharacterEntersPlay>) {
        if(event.originalLocation === Location.Hand) {
            this.charactersPlayedThisPhase.add(event.card);
        }
    }
}
