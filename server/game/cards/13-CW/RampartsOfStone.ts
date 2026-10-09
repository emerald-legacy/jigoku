import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';
import { bow, chosenDiscard } from '../../GameActions/GameActions.js';

class RampartsOfStone extends DrawCard {
    static id = 'ramparts-of-stone';

    setupCardAbilities() {
        this.conflictAction('Attacker bows participating characters or discards three cards from hand')
            .select({
                name: 'select',
                player: (context) => {
                    if(context.player.isAttackingPlayer()) {
                        return Players.Self;
                    }
                    return Players.Opponent;
                }
            }, {
                'Bow all participating characters': bow((context) => {
                    const targetPlayer = context.player.isAttackingPlayer() ? context.player : context.player.opponent;
                    return {
                        target: context.game.currentConflict?.getCharacters(targetPlayer)
                    };
                }),
                'Discard three cards from hand': chosenDiscard({amount: 3})
            });
    }
}


export default RampartsOfStone;
