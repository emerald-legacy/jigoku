import { Duration } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';

export default class PerfectGuest extends DrawCard {
    static id = 'perfect-guest';

    private barredThisRound?: Player;
    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onRoundEnded']);

        this.action('Give control of this character')
            .condition((context) => context.player.opponent !== undefined && context.player !== this.barredThisRound)
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => ({
                effect: AbilityDsl.effects.takeControl(context.player.opponent),
                duration: Duration.Custom
            })))
            .then((context) => ({
                gameAction: AbilityDsl.actions.handler({
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
