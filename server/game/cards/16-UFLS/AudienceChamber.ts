import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes } from '../../Constants.js';

class AudienceChamber extends DrawCard {
    static id = 'audience-chamber';

    setupCardAbilities() {
        this.reaction({
            title: 'Place fate on character',
            when: {
                onCardPlayed: (event, context) =>
                    event.player === context.player &&
                    event.card.type === CardTypes.Character &&
                    event.card.getCost() >= 4
            },
            gameAction: AbilityDsl.actions.placeFate((context) => ({
                target: context.event.card
            }))
        });
    }
}


export default AudienceChamber;
