import { Durations } from '../../Constants.js';
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

        this.action({
            title: 'Give control of this character',
            effect: 'give control of itself to {1}',
            effectArgs: (context) => [context.player.opponent ?? context.player],
            condition: (context) => context.player.opponent !== undefined && !this.triggeredThisRound,
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => {
                this.triggeredThisRound = true;
                return {
                    effect: AbilityDsl.effects.takeControl(context.player.opponent),
                    duration: Durations.Custom
                };
            })
        });
    }

    public onRoundEnded() {
        this.triggeredThisRound = false;
    }
}
