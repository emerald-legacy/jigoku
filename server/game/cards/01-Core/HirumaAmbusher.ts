import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HirumaAmbusher extends DrawCard {
    static id = 'hiruma-ambusher';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Disable a character')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source && context.source.isDefending()
            })
            .target('target', {
                cardType: CardType.Character
            }, ability.actions.cardLastingEffect({
                effect: ability.effects.cannotTriggerAbilities()
            }))
            .effect('prevent {0} from using any abilities');
    }
}


export default HirumaAmbusher;
