import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HirumaAmbusher extends DrawCard {
    static id = 'hiruma-ambusher';

    setupCardAbilities() {
        this.reaction('Disable a character')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source && context.source.isDefending()
            })
            .target('target', {
                cardType: CardType.Character
            }, AbilityDsl.actions.cardLastingEffect({
                effect: AbilityDsl.effects.cannotTriggerAbilities()
            }))
            .effect('prevent {0} from using any abilities');
    }
}


export default HirumaAmbusher;
