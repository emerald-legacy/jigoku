import DrawCard from '../../drawcard.js';
import { Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ElegantTessen extends DrawCard {
    static id = 'elegant-tessen';

    setupCardAbilities() {
        this.reaction({
            title: 'Ready attached character',
            when: {
                onCardAttached: (event: any, context) => (
                    context.source.parent && event.card === context.source && context.source.parent.getCost() <= 2 &&
                    event.originalLocation !== Locations.PlayArea
                )
            },
            gameAction: AbilityDsl.actions.ready(context => ({ target: context.source.parent }))
        });
    }
}


export default ElegantTessen;
