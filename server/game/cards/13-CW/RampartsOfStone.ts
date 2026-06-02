import DrawCard from '../../DrawCard.js';
import { Players, TargetMode } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class RampartsOfStone extends DrawCard {
    static id = 'ramparts-of-stone';

    setupCardAbilities() {
        this.action({
            title: 'Attacker bows participating characters or discards three cards from hand',
            condition: context => context.game.isDuringConflict(),
            targets: {
                select: {
                    mode: TargetMode.Select,
                    player: (context) => {
                        if(context.player.isAttackingPlayer()) {
                            return Players.Self;
                        }
                        return Players.Opponent;
                    },
                    choices: {
                        'Bow all participating characters': AbilityDsl.actions.bow((context) => {
                            let targetPlayer = context.player.isAttackingPlayer() ? context.player : context.player.opponent;
                            return {
                                target: context.game.currentConflict.getCharacters(targetPlayer)
                            };
                        }),
                        'Discard three cards from hand': AbilityDsl.actions.chosenDiscard({amount: 3})
                    }
                }
            }
        });
    }
}


export default RampartsOfStone;
