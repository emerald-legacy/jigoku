import { honor } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Phase, Players } from '../../Constants.js';

class KakitaRyoku extends DrawCard {
    static id = 'kakita-ryoku';

    setupCardAbilities() {
        this.reaction('Honor a character if you have the Imperial Favor')
            .when({
                onPhaseStarted: (event, context) => event.phase !== Phase.Setup && context.player.imperialFavor !== ''
            })
            .target({
                cardType: CardType.Character,
                controller: Players.Any
            }, honor());
    }
}


export default KakitaRyoku;
