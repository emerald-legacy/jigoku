import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import { ready } from '../../GameActions/GameActions.js';

class ElegantTessen extends DrawCard {
    static id = 'elegant-tessen';

    setupCardAbilities() {
        this.reaction('Ready attached character')
            .when({
                onCardAttached: (event, context) => (
                    context.source.parentCharacter && event.card === context.source && (context.source.parentCharacter.getCost() ?? 0) <= 2 &&
                    event.originalLocation !== Location.PlayArea
                )
            })
            .gameAction(ready(context => ({ target: context.source.parentCharacter ?? [] })));
    }
}


export default ElegantTessen;
