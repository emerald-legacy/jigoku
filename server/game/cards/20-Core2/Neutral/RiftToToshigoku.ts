import { Players, CardType, EventName, AbilityType } from '../../../Constants.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { discardFromPlay } from '../../../GameActions/GameActions.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import type { Event } from '../../../Events/Event.js';

export default class RiftToToshigoku extends ProvinceCard {
    static id = 'rift-to-toshigoku';

    private cancelRingEffectsInConflict?: string;

    public setupCardAbilities() {
        new EventRegistrar(this.game, this).register([
            {
                [EventName.OnResolveRingElement + ':' + AbilityType.WouldInterrupt]: 'cancelRingEffect'
            }
        ]);

        this.reaction('Force opponent to remove all fate from a character and resolve the conflict')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            })
            .cost(AbilityDsl.costs.breakSelf())
            .target({
                activePromptTitle: 'Choose a character to discard',
                player: Players.Opponent,
                controller: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, discardFromPlay())
            .onResolve((context) => {
                this.cancelRingEffectsInConflict = context.game.currentConflict?.uuid;
            });
    }

    public cancelRingEffect(event: Event) {
        if(
            this.game.currentConflict &&
            this.game.currentConflict.uuid === this.cancelRingEffectsInConflict &&
            this.isConflictProvince() &&
            !event.cancelled
        ) {
            event.cancel();
            this.game.addMessage('{0} cancels the ring effect', this);
        }
    }
}
