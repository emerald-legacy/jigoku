import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class YasukiOguri extends DrawCard {
    static id = 'yasuki-oguri';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain +1/+1',
            limit: ability.limit.unlimitedPerConflict(),
            when: {
                onCardPlayed: (event, context) => event.player === context.player.opponent && event.card.type === CardTypes.Event && context.source.isDefending()
            },
            effect: 'give him +1{1}/+1{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(1) })
        });
    }
}


export default YasukiOguri;
