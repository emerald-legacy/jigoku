import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';

class YasukiBroker extends DrawCard {
    static id = 'yasuki-broker';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            match: card => card.getType() === CardType.Character,
            targetController: Players.Self,
            effect: [
                AbilityDsl.effects.addKeyword('courtesy'),
                AbilityDsl.effects.addKeyword('sincerity')
            ]
        });
    }
}


export default YasukiBroker;
