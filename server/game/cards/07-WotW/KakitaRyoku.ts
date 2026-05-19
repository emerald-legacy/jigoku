import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';

class KakitaRyoku extends DrawCard {
    static id = 'kakita-ryoku';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Honor a character if you have the Imperial Favor',
            when: {
                onPhaseStarted: (event, context) => event.phase !== 'setup' && context.player.imperialFavor !== ''
            },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                gameAction: ability.actions.honor()
            }
        });
    }
}


export default KakitaRyoku;
