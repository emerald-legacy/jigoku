import DrawCard from '../../drawcard';
import { CardTypes, Players } from '../../Constants';

class YasukiBroker extends DrawCard {
    static id = 'yasuki-broker';

    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            match: card => card.getType() === CardTypes.Character,
            targetController: Players.Self,
            effect: [
                ability.effects.addKeyword('courtesy'),
                ability.effects.addKeyword('sincerity')
            ]
        });
    }
}


export default YasukiBroker;
