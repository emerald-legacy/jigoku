import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class AudienceChamber extends DrawCard {
    static id = 'audience-chamber';

    override setupCardAbilities() {
        this.reaction('Place fate on character')
            .when({
                onCardPlayed: (event, context) =>
                    event.player === context.player &&
                    event.card.type === CardType.Character &&
                    event.card.costAtLeast(4)
            })
            .placeFate((context) => ({
                target: context.event.card
            }));
    }
}


export default AudienceChamber;
