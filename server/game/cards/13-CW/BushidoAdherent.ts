import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { honor } from '../../GameActions/GameActions.js';

class BushidoAdherent extends DrawCard {
    static id = 'bushido-adherent';

    setupCardAbilities() {
        this.action('Honor a character')
            .condition((context) => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, honor())
            .draw((context) => ({ target: context.player.opponent }))
            .chatText('honor {0} and have {1} draw 1 card', (context) => [context.player.opponent ?? context.player]);
    }
}


export default BushidoAdherent;
