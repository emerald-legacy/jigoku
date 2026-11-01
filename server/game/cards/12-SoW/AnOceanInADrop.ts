import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { draw, moveCard, sequential } from '../../GameActions/GameActions.js';
import { shuffle } from '../../utils/random.js';
import type Player from '../../Player.js';
import { playerChoices } from '../playerChoices.js';

class AnOceanInADrop extends DrawCard {
    static id = 'an-ocean-in-a-drop';

    override setupCardAbilities() {
        this.action('Place hand on bottom of deck and draw cards')
            .condition((context) => !!(context.source.parentCharacter && context.source.parentCharacter.isParticipating()))
            .cost(costs.sacrificeSelf())
            .selectFrom({
                targets: true
            }, (context) => playerChoices(context.player, (player) => sequential(this.getGameActions(player))))
            .chatText((context) => {
                const player = (context.select === context.player.name || !context.player.opponent) ? context.player : context.player.opponent;
                const amount = player.hand.length;
                return msg`place ${player.name}'s hand on the bottom of their deck and have them draw ${amount} card${amount === 1 ? '' : 's'}`;
            });
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
