import DrawCard from '../../DrawCard.js';
import { honor } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';

class ShibaPureheart extends DrawCard {
    static id = 'shiba-pureheart';

    override setupCardAbilities() {
        this.reaction('Honor a character')
            .when({
                onConflictDeclared: (event, context) => {
                    const controller = context.player;
                    const attacker = event.conflict.attackingPlayer;
                    if(attacker === controller.opponent) {
                        return this.game.getDeclaredConflictCount(attacker) === 2;
                    }
                    return false;
                }
            })
            .target({
                cardType: CardType.Character
            }, honor());
    }
}


export default ShibaPureheart;
