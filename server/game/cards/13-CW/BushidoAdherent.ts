import { msg } from '../../GameChat.js';
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
            .chatText((context) => msg`honor ${context.chatTarget()} and have ${context.player.opponent ?? context.player} draw 1 card`);
    }
}


export default BushidoAdherent;
