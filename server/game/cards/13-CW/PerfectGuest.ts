import { Duration, EventName } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import { takeControl } from '../../effects.js';
import { cardLastingEffect, handler } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';

export default class PerfectGuest extends DrawCard {
    static id = 'perfect-guest';

    private barredThisRound?: Player;

    public setupCardAbilities() {
        new EventRegistrar(this.game, this).register([EventName.OnRoundEnded]);

        this.action('Give control of this character')
            .condition((context) => context.player.opponent !== undefined && context.player !== this.barredThisRound)
            .gameAction(cardLastingEffect((context) => ({
                effect: takeControl(context.player.opponent),
                duration: Duration.Custom
            })))
            .then((context) => ({
                gameAction: handler({
                    handler: () => {
                        this.barredThisRound = context.player.opponent;
                    }
                })
            }))
            .effect('give control of itself to {1}', (context) => [context.player.opponent ?? context.player]);
    }

    public onRoundEnded() {
        this.barredThisRound = undefined;
    }
}
