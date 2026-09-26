import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import type { StatusToken } from '../../StatusToken.js';

class ExiledGuardian extends DrawCard {
    static id = 'exiled-guardian';

    setupCardAbilities() {
        this.action('Discard a status token off a character or province')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .tokenTarget('target', {
                cardType: [CardType.Character, CardType.Province],
                location: Location.Any
            }, AbilityDsl.actions.discardStatusToken())
            .effect('discard {1}\'s {2}', context => {
                const token: StatusToken | StatusToken[] | undefined = context.token;
                return [
                    Array.isArray(token) ? token[0]?.card : undefined,
                    context.token
                ];
            });
    }
}


export default ExiledGuardian;
