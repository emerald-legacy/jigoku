import { addKeyword } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';

class YasukiBroker extends DrawCard {
    static id = 'yasuki-broker';

    override setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isParticipating(),
            match: (card) => card.type === CardType.Character,
            targetController: Players.Self,
            effect: [
                addKeyword('courtesy'),
                addKeyword('sincerity')
            ]
        });
    }
}


export default YasukiBroker;
