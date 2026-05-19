import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class BushidoAdherent extends DrawCard {
    static id = 'bushido-adherent';

    setupCardAbilities() {
        this.action({
            title: 'Honor a character',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.honor()
            },
            gameAction: AbilityDsl.actions.draw(context => ({ target: context.player.opponent })),
            effect: 'honor {0} and have {1} draw 1 card',
            effectArgs: context => context.player.opponent
        });
    }
}


export default BushidoAdherent;
