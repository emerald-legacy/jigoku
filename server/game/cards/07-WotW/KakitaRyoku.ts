import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';

class KakitaRyoku extends DrawCard {
    static id = 'kakita-ryoku';

    setupCardAbilities() {
        this.reaction('Honor a character if you have the Imperial Favor')
            .when({
                onPhaseStarted: (event, context) => event.phase !== 'setup' && context.player.imperialFavor !== ''
            })
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Any
            }, AbilityDsl.actions.honor());
    }
}


export default KakitaRyoku;
