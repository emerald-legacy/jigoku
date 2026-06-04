import { Players, CardType, EventName, AbilityType } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import type { Event } from '../../../Events/Event.js';
import type { AbilityContext } from '../../../AbilityContext.js';

export default class RiftToToshigoku extends ProvinceCard {
    static id = 'rift-to-toshigoku';

    private eventRegistrar?: EventRegistrar;
    private shouldCancelRingEffectsHere?: boolean;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([
            {
                [EventName.OnResolveRingElement + ':' + AbilityType.WouldInterrupt]: 'cancelRingEffect'
            }
        ]);

        this.reaction({
            title: 'Force opponent to remove all fate from a character and resolve the conflict',
            when: {
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            },
            cost: AbilityDsl.costs.breakSelf(),
            target: {
                activePromptTitle: 'Choose a character to discard',
                player: Players.Opponent,
                controller: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking(),
                gameAction: AbilityDsl.actions.discardFromPlay()
            },
            then: (_context) => {
                this.shouldCancelRingEffectsHere = true;
            }
        });
    }

    public cancelRingEffect(event: Event) {
        if(
            (event.context as AbilityContext).game.currentConflict &&
            this.isConflictProvince() &&
            this.shouldCancelRingEffectsHere &&
            !event.cancelled
        ) {
            event.cancel();
            this.game.addMessage('{0} cancels the ring effect', this);
        }
    }
}
