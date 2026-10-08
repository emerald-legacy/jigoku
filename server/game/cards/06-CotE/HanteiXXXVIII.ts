import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { delayedEffect } from '../../effects.js';
import { bow, discardFromPlay } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class HanteiXXXVIII extends DrawCard {
    static id = 'hantei-xxxviii';

    setupCardAbilities() {
        this.persistentEffect({
            effect: delayedEffect({
                condition: (context) => context.player.opponent && !!context.player.opponent.imperialFavor,
                message: '{0} is discarded from play as its controller\'s opponent has the imperial favor',
                messageArgs: (context) => [context.source],
                gameAction: discardFromPlay()
            })
        });

        this.action('Bow a character')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating()
            }, bow());

        this.interrupt('Choose targets for opponent\'s ability')
            .when({
                onCardAbilityInitiated: (event, context) =>
                    event.ability.hasTargetsChosenByInitiatingPlayer(event.context) && event.context.player === context.player.opponent
            })
            .handler(context => {
                context.event.context.choosingPlayerOverride = context.player;
            })
            .chatText((context) => msg`choose targets for ${context.event.card}'s ${context.event.ability.title} ability`);
    }
}


export default HanteiXXXVIII;
