import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Phases, Players } from '../../Constants.js';

class KakitaRyoku extends DrawCard {
    static id = 'kakita-ryoku';

    setupCardAbilities() {
        this.reaction('Honor a character if you have the Imperial Favor')
            .when({
                onPhaseStarted: (event, context) => event.phase !== Phases.Setup && context.player.imperialFavor !== ''
            })
            .target({
                cardType: CardType.Character,
                controller: Players.Any
            }, AbilityDsl.actions.honor());
    }
}


export default KakitaRyoku;
