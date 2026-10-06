import { CardType, EventName, Location } from '../../../Constants.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import AbilityDsl from '../../../abilitydsl.js';
import { putIntoPlay } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';

export default class BloodthirstyOnryo extends DrawCard {
    static id = 'bloodthirsty-onryo';

    public setupCardAbilities() {
        new EventRegistrar(this.game, this).register([EventName.OnCardLeavesPlay]);

        this.action('Put this into play')
            .cost(AbilityDsl.costs.sacrifice({ cardType: CardType.Character }))
            .gameAction(putIntoPlay())
            .location([Location.Provinces, Location.DynastyDiscardPile]);
    }

    public onCardLeavesPlay(event: EventPayload<EventName.OnCardLeavesPlay>) {
        if(event.card === this && this.location !== Location.RemovedFromGame) {
            this.game.addMessage('{0} is removed from the game due to leaving play', this);
            this.owner.moveCard(this, Location.RemovedFromGame);
        }
    }
}
