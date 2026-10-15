import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';

class Kikyo extends DrawCard {
    static id = 'kikyo';

    override setupCardAbilities() {
        this.attachmentConditions({
            unique: true,
            faction: 'crab'
        });

        this.whileAttached({
            effect: gainAbility.reaction('Make opponent discard a card at random', (ability) => ability
                .when({
                    onCardsDrawn: (event, context) => {
                        return context.player.opponent && event.player === context.player && context.source.isParticipating();
                    }
                })
                .discardAtRandom())
        });
    }
}


export default Kikyo;
