import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes } from '../../Constants.js';

class HighlightTheFlaws extends DrawCard {
    static id = 'highlight-the-flaws';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel conflict province ability',
            when: {
                onInitiateAbilityEffects: event => event.card.type === CardTypes.Province
            },
            effect: 'cancel the effects of {1}\'s ability',
            effectArgs: context => context.event.card ?? '',
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}


export default HighlightTheFlaws;
