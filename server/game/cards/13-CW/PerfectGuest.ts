import { Duration, EventName } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import { takeControl } from '../../effects.js';
import { handler } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import { msg } from '../../GameChat.js';

export default class PerfectGuest extends DrawCard {
    static id = 'perfect-guest';

    private barredThisRound?: Player;

    public setupCardAbilities() {
        new EventRegistrar(this.game).register({
            [EventName.OnRoundEnded]: () => this.onRoundEnded()
        });

        this.action('Give control of this character')
            .condition((context) => context.player.opponent !== undefined && context.player !== this.barredThisRound)
            .cardLastingEffect((context) => ({
                effect: takeControl(context.player.opponent),
                duration: Duration.Custom
            }))
            .chatText((context) => msg`give control of itself to ${context.player.opponent ?? context.player}`)
            .then()
            .gameAction(handler({
                handler: (context) => {
                    this.barredThisRound = context.player.opponent;
                }
            }));
    }

    public onRoundEnded() {
        this.barredThisRound = undefined;
    }
}
