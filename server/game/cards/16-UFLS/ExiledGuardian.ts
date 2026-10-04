import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ExiledGuardian extends DrawCard {
    static id = 'exiled-guardian';

    setupCardAbilities() {
        this.action('Discard a status token off a character or province')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .tokenTarget('target', {
                cardType: [CardType.Character, CardType.Province],
                location: Location.Any
            }, AbilityDsl.actions.discardStatusToken())
            .effect('discard {1}\'s {2}', context => [context.token[0].card, context.token]);
    }
}


export default ExiledGuardian;
