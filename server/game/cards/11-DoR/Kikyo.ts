import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';
import { discardAtRandom } from '../../GameActions/GameActions.js';

class Kikyo extends DrawCard {
    static id = 'kikyo';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true,
            faction: 'crab'
        });

        this.whileAttached({
            effect: gainAbility.reaction('Make opponent discard a card at random', {
                onCardsDrawn: (event, context) => {
                    return context.player.opponent && event.player === context.player && context.source.isParticipating();
                }
            }, (ability) => ability.gameAction(discardAtRandom()))
        });
    }
}


export default Kikyo;
