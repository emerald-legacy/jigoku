import { CardType, EventName, Location, Phases } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import type { EventPayload } from '../../Events/EventPayloads.js';

export default class SoshiShadowshaper extends DrawCard {
    static id = 'soshi-shadowshaper';

    private charactersPlayedThisPhase = new Set<BaseCard>();

    public setupCardAbilities() {
        const eventRegistrar = new EventRegistrar(this.game, this);
        eventRegistrar.register([EventName.OnPhaseStarted, EventName.OnCharacterEntersPlay]);

        this.action('Return a character to owner\'s hand')
            .cost(AbilityDsl.costs.payHonor(1))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => (card.getCost() ?? 0) < 3 && this.charactersPlayedThisPhase.has(card)
            }, AbilityDsl.actions.returnToHand())
            .phase(Phases.Conflict);
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
