import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes } from '../../Constants.js';

class EarthBecomesSky extends DrawCard {
    static id = 'earth-becomes-sky';

    setupCardAbilities() {
        this.reaction({
            title: 'Bow a character that just readied',
            when: {
                onCardReadied: (event, context) =>
                    event.card.type === CardTypes.Character && event.card.controller === context.player.opponent
            },
            gameAction: AbilityDsl.actions.bow((context) => ({ target: context.event.card }))
        });
    }
}


export default EarthBecomesSky;
