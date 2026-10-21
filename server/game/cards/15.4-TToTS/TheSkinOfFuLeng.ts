import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { AbilityType, CardType, EffectName, EventName, Location, Players, RestrictionType, RestrictionScope } from '../../Constants.js';
import { canBeTriggeredByOpponent, playerCannot } from '../../effects.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';
import type { GameEvent } from '../../Events/EventPayloads.js';

class TheSkinOfFuLeng extends DrawCard {
    static id = 'the-skin-of-fu-leng';

    override setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true
        });

        this.persistentEffect({
            targetController: Players.Opponent,
            effect: playerCannot({
                cannot: RestrictionType.TriggerAbilities,
                appliesTo: [RestrictionScope.CharactersWithNoFate, RestrictionScope.NonForcedAbilities]
            })
        });

        this.persistentEffect({
            match: (card) => card.type === CardType.Character && card.getFate() === 0,
            targetController: Players.Opponent,
            effect: canBeTriggeredByOpponent()
        });

        // as the ability is initiated, the character's controller is the player using the Skin
        new EventRegistrar(this.game).registerTriggerWindow(EventName.OnCardAbilityInitiated, AbilityType.WouldInterrupt, (event) => this.discardAttachmentsNoLongerLegal(event));
    }

    /** "Attach to a character you control" attachments of the character's controller fall off while the Skin's player uses it. */
    private discardAttachmentsNoLongerLegal(event: GameEvent<EventName.OnCardAbilityInitiated>): void {
        const player = event.context.player;
        const character = event.card;
        if(this.location !== Location.PlayArea || this.isBlank() || player !== this.controller || !character.isDrawCard() ||
            character.type !== CardType.Character || character.controller === player) {
            return;
        }
        const illegal = character.attachments.filter((attachment) =>
            attachment.anyEffect(EffectName.AttachmentMyControlOnly) && attachment.controller !== player);
        if(illegal.length > 0) {
            const plural = illegal.length > 1;
            this.game.addMessage(msg`${illegal} ${plural ? 'are' : 'is'} discarded from ${character} as ${plural ? 'they' : 'it'} ${plural ? 'are' : 'is'} no longer legally attached`);
            this.game.resolveActions([discardFromPlay({ target: illegal })], this.game.getFrameworkContext(character.controller));
        }
    }
}


export default TheSkinOfFuLeng;
