import { Duration } from '../../Constants.js';
import { EventRegistrar } from '../../EventRegistrar.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class PerfectGuest extends DrawCard {
    static id = 'perfect-guest';

    private triggeredThisRound = false;
    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onRoundEnded']);

        this.action('Give control of this character')
            .condition((context) => context.player.opponent !== undefined && !this.triggeredThisRound)
            .gameAction(AbilityDsl.actions.cardLastingEffect((context) => {
                this.triggeredThisRound = true;
                return {
                    effect: AbilityDsl.effects.takeControl(context.player.opponent),
                    duration: Duration.Custom
                };
            }))
            .effect('give control of itself to {1}', (context) => [context.player.opponent ?? context.player]);
    }

    public onRoundEnded() {
        this.triggeredThisRound = false;
    }
}
