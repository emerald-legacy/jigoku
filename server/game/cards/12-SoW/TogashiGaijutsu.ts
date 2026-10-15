import DrawCard from '../../DrawCard.js';
import { CardType, Trait } from '../../Constants.js';

class TogashiGaijutsu extends DrawCard {
    static id = 'togashi-gaijutsu';

    setupCardAbilities() {
        this.reaction('Ready a character')
            .when({
                onCardPlayed: (event, context) =>
                    event.card.parentCharacter &&
                    event.card.type === CardType.Attachment &&
                    event.card.hasTrait(Trait.Tattoo) &&
                    event.card.controller === context.player
            })
            .ready((context) => ({ target: context.event.card.parentCharacter ?? [] }));
    }
}


export default TogashiGaijutsu;
