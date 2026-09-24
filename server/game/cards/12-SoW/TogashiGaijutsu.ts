import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class TogashiGaijutsu extends DrawCard {
    static id = 'togashi-gaijutsu';

    setupCardAbilities() {
        this.reaction({
            title: 'Ready a character',
            when: {
                onCardPlayed: (event, context) =>
                    event.card.parentCharacter &&
                    event.card.type === CardType.Attachment &&
                    event.card.hasTrait('tattoo') &&
                    event.card.controller === context.player
            },
            gameAction: AbilityDsl.actions.ready((context) => ({ target: context.event.card.parentCharacter }))
        });
    }
}


export default TogashiGaijutsu;
