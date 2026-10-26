import { msg } from '../../GameChat.js';
import { Duration, Location, Players } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { blank } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class Desolation extends DrawCard {
    static id = 'desolation';

    public override setupCardAbilities() {
        this.action('Blank opponent\'s provinces')
            .condition((context) => context.player.opponent !== undefined)
            .cost(costs.payHonor(2))
            .handler((context) => {
                const opponent = context.player.opponent;
                // a match rather than a lasting effect on each card: turning a province facedown would remove that
                context.source.applyDurationEffect(Duration.UntilEndOfPhase, {
                    match: (card) => card.isCard() && card.isProvince && card.controller === opponent,
                    targetLocation: Location.Provinces,
                    targetController: Players.Opponent,
                    ability: context.ability,
                    controller: context.player,
                    effect: blank()
                });
            })
            .chatText((context) => msg`blank ${context.player.opponent?.name ?? ''}'s provinces until the end of the phase`);
    }
}
