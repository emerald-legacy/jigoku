import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';
import { discardAtRandom } from '../../GameActions/GameActions.js';
import { AbilityType } from '../../Constants.js';

class Kikyo extends DrawCard {
    static id = 'kikyo';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true,
            faction: 'crab'
        });

        this.whileAttached({
            effect: gainAbility(AbilityType.Reaction, {
                title: 'Make opponent discard a card at random',
                when: {
                    onCardsDrawn: (event, context) => {
                        return context.player.opponent && event.player === context.player && context.source.isParticipating();
                    }
                },
                printedAbility: false,
                gameAction: discardAtRandom()
            })
        });
    }
}


export default Kikyo;
