import { cardCannot } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class KitsukiYuikimi extends DrawCard {
    static id = 'kitsuki-yuikimi';

    public setupCardAbilities() {
        this.reaction('Cannot be targeted by opponent\'s triggered abilities')
            .when({
                onMoveFate: (event, context) =>
                    context.source.isParticipating() &&
                    event.origin &&
                    event.origin.type === 'ring' &&
                    event.recipient === context.player &&
                    context.player.opponent !== undefined
            })
            .cardLastingEffect((context) => ({
                effect: cardCannot({
                    cannot: 'target',
                    restricts: 'opponentsTriggeredAbilities',
                    applyingPlayer: context.player
                })
            }))
            .effect('prevent {0} from being chosen as the target of {1}\'s triggered abilities until the end of the conflict', (context) => [context.player.opponent]);
    }
}
