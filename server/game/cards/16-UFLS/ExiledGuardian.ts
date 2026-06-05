import DrawCard from '../../DrawCard.js';
import { TargetMode, CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import type { StatusToken } from '../../StatusToken.js';

class ExiledGuardian extends DrawCard {
    static id = 'exiled-guardian';

    setupCardAbilities() {
        this.action({
            title: 'Discard a status token off a character or province',
            cost: AbilityDsl.costs.sacrificeSelf(),
            target: {
                mode: TargetMode.Token,
                cardType: [CardType.Character, CardType.Province],
                location: Location.Any,
                gameAction: AbilityDsl.actions.discardStatusToken()
            },
            effect: 'discard {1}\'s {2}',
            effectArgs: context => {
                const token: StatusToken | StatusToken[] | undefined = context.token;
                return [
                    Array.isArray(token) ? token[0]?.card : undefined,
                    context.token
                ];
            }
        });
    }
}


export default ExiledGuardian;
