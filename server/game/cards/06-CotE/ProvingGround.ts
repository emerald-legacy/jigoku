import { perRound } from '../../AbilityLimit.js';
import DrawCard from '../../DrawCard.js';

class ProvingGround extends DrawCard {
    static id = 'proving-ground';

    override setupCardAbilities() {
        this.reaction('Draw a card after winning a duel')
            // once per winning character you control (EmeraldDB ruling)
            .when({
                onCharacterWinsDuel: (event, context) => event.card.controller === context.player
            })
            .draw()
            .limit(perRound(2));
    }
}


export default ProvingGround;
