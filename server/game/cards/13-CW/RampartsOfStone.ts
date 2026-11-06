import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';
import { bow, chosenDiscard } from '../../GameActions/GameActions.js';

class RampartsOfStone extends DrawCard {
    static id = 'ramparts-of-stone';

    override setupCardAbilities() {
        this.action('Attacker bows participating characters or discards three cards from hand')
            .condition((context) => context.game.isDuringConflict())
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
                'Discard three cards from hand': chosenDiscard((context) => ({
                    amount: 3,
                    target: context.game.currentConflict?.attackingPlayer
                }))
            });
    }
}


export default RampartsOfStone;
