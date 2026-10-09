import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class HighlightTheFlaws extends DrawCard {
    static id = 'highlight-the-flaws';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel conflict province ability')
            .when({
                onInitiateAbilityEffects: (event) => event.card.type === CardType.Province
            })
            .cancel()
            .chatText((context) => msg`cancel the effects of ${context.event.card}'s ability`);
    }
}


export default HighlightTheFlaws;
