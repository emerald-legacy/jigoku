import DrawCard from '../../drawcard.js';
import { TargetModes, CardTypes, Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ExiledGuardian extends DrawCard {
    static id = 'exiled-guardian';

    setupCardAbilities() {
        this.action({
            title: 'Discard a status token off a character or province',
            cost: AbilityDsl.costs.sacrificeSelf(),
            target: {
                mode: TargetModes.Token,
                cardType: [CardTypes.Character, CardTypes.Province],
                location: Locations.Any,
                gameAction: AbilityDsl.actions.discardStatusToken()
            },
            effect: 'discard {1}\'s {2}',
            effectArgs: context => [
                context.token[0].card,
                context.token
            ]
        });
    }
}


export default ExiledGuardian;
