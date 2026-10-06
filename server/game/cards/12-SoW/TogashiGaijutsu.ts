import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { ready } from '../../GameActions/GameActions.js';

class TogashiGaijutsu extends DrawCard {
    static id = 'togashi-gaijutsu';

    setupCardAbilities() {
        this.reaction('Ready a character')
            .when({
                onCardPlayed: (event, context) =>
                    event.card.parentCharacter &&
                    event.card.type === CardType.Attachment &&
                    event.card.hasTrait('tattoo') &&
                    event.card.controller === context.player
            })
            .gameAction(ready((context) => ({ target: context.event.card.parentCharacter ?? [] })));
    }
}


export default TogashiGaijutsu;
