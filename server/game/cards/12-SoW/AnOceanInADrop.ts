import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { draw, moveCard, sequential } from '../../GameActions/GameActions.js';
import { shuffle } from '../../utils/random.js';
import type Player from '../../Player.js';
import { playerChoices } from '../playerChoices.js';

class AnOceanInADrop extends DrawCard {
    static id = 'an-ocean-in-a-drop';

    setupCardAbilities() {
        this.action('Place hand on bottom of deck and draw cards')
            .cost(costs.sacrificeSelf())
            .condition(context => !!(context.source.parentCharacter && context.source.parentCharacter.isParticipating()))
            .selectFrom({
                targets: true
            }, (context) => playerChoices(context.player, (player) => sequential(this.getGameActions(player))))
            .chatText('place {1}\'s hand on the bottom of their deck and have them draw {2} cards', (context) => (context.select === context.player.name || !context.player.opponent) ?
                [context.player.name, context.player.hand.length] :
                [context.player.opponent.name, context.player.opponent.hand.length]);
    }

    getGameActions(player: Player) {
        return [
            moveCard(() => ({
                shuffle: false,
                bottom: true,
                destination: Location.ConflictDeck,
                target: shuffle(player.hand)
            })),
            draw((context) => ({ target: player, amount: context.events.length }))
        ];
    }
}


export default AnOceanInADrop;
