import { bow } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class DojiFumiki extends DrawCard {
    static id = 'doji-fumiki';

    setupCardAbilities() {
        this.action('Bow a dishonored character')
            .condition((context) => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isDishonored && card.isParticipating()
            }, bow());
    }
}


export default DojiFumiki;
