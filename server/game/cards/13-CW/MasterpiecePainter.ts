import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import { multiple, playerLastingEffect } from '../../GameActions/GameActions.js';
import { playerChoices } from '../playerChoices.js';
import { revealedTopCardPlayable } from '../revealedTopCardPlayable.js';

class MasterpiecePainter extends DrawCard {
    static id = 'masterpiece-painter';

    setupCardAbilities() {
        this.action('Reveal and may play top conflict card')
            .selectFrom({
                targets: true,
                activePromptTitle: 'Choose any number of players'
            }, (context) => playerChoices(
                context.player,
                (player) => this.revealAndMayPlayAbility(player),
                (player, opponent) => multiple([
                    this.revealAndMayPlayAbility(player),
                    this.revealAndMayPlayAbility(opponent)
                ])
            ))
            .chatText((context) => msg`make ${context.select} reveal the top card of their deck. They may play their card until the end of the phase`);
    }

    revealAndMayPlayAbility(player: Player) {
        return playerLastingEffect(() => revealedTopCardPlayable(player, this, 'phase'));
    }
}


export default MasterpiecePainter;
