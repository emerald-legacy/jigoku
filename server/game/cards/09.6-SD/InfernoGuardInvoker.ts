import { msg } from '../../GameChat.js';
import { CardType, Duration, EventName, Players, ConflictType } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import { delayedEffect } from '../../effects.js';
import { cardLastingEffect, honor, sacrifice } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class InfernoGuardInvoker extends DrawCard {
    static id = 'inferno-guard-invoker';

    private provinceBroken = false;
    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventName.OnBreakProvince, EventName.OnConflictDeclared]);

        this.action('honor this character')
            .condition((context) => context.game.isDuringConflict(ConflictType.Military))
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            }, honor(), cardLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                effect: delayedEffect({
                    when: {
                        onConflictFinished: () => this.provinceBroken
                    },
                    message: () => msg`${context.target} is discarded, burned to a pile of ash due to the delayed effect of ${context.source}`,
                    gameAction: sacrifice({ target: context.target })
                })
            })))
            .chatText('honor {0}. It will be discarded if a province is broken this conflict');
    }

    public onBreakProvince() {
        this.provinceBroken = true;
    }

    public onConflictDeclared() {
        this.provinceBroken = false;
    }
}
