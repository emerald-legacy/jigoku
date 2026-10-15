import { msg } from '../../GameChat.js';
import { CardType, EventName, Players, ConflictType } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import { atEndOfConflict, honor, sacrifice } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class InfernoGuardInvoker extends DrawCard {
    static id = 'inferno-guard-invoker';

    private provinceBroken = false;
    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game);
        this.eventRegistrar.register({
            [EventName.OnBreakProvince]: () => this.onBreakProvince(),
            [EventName.OnConflictDeclared]: () => this.onConflictDeclared()
        });

        this.action('honor this character')
            .condition((context) => context.game.isDuringConflict(ConflictType.Military))
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isParticipating()
            }, honor(), atEndOfConflict((context) => ({
                onlyIf: () => this.provinceBroken,
                message: () => msg`${context.target} is discarded, burned to a pile of ash due to the delayed effect of ${context.source}`,
                gameAction: sacrifice({ target: context.target })
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
