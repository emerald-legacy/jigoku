import { CardType, EventName } from '../../../Constants.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class ZealousExorcist extends DrawCard {
    static id = 'zealous-exorcist';

    private charactersPlayedThisConflict = new WeakSet<DrawCard>();

    public setupCardAbilities() {
        new EventRegistrar(this.game, this).register([EventName.OnConflictStarted, EventName.OnCharacterEntersPlay]);

        this.action('Remove a character from play')
            .condition((context) => context.source.isParticipating())
            .target('target', {
                cardType: CardType.Character,
                cardCondition: (card) => this.charactersPlayedThisConflict.has(card)
            }, AbilityDsl.actions.removeFromGame());
    }

    public onConflictStarted() {
        this.charactersPlayedThisConflict = new WeakSet();
    }

    public onCharacterEntersPlay(event: EventPayload<EventName.OnCharacterEntersPlay>) {
        this.charactersPlayedThisConflict.add(event.card);
    }
}
