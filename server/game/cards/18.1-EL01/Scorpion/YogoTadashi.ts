import { msg } from '../../../GameChat.js';
import DrawCard from '../../../DrawCard.js';
import { cardCannot } from '../../../effects.js';
import { cardLastingEffect } from '../../../GameActions/GameActions.js';
import { CardType, Players } from '../../../Constants.js';

class YogoTadashi extends DrawCard {
    static id = 'yogo-tadashi';

    setupCardAbilities() {
        this.reaction('Prevent a character from being targeted by events')
            .when({
                onConflictDeclared: (event, context) => event.attackers?.includes(context.source) ?? false,
                onDefendersDeclared: (event, context) => event.defenders.includes(context.source),
                onMoveToConflict: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Character,
                controller: Players.Any
            }, cardLastingEffect({
                effect: cardCannot({
                    cannot: 'target',
                    restricts: 'opponentsEvents'
                })
            }))
            .chatText((context) => msg`prevent ${context.chatTarget()} from being targeted by events played by ${context.player.opponent}`);
    }
}

export default YogoTadashi;
