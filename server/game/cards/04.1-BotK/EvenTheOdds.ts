import DrawCard from '../../DrawCard.js';
import { Players, CardType, Trait } from '../../Constants.js';
import { honor, moveToConflict } from '../../GameActions/GameActions.js';

class EvenTheOdds extends DrawCard {
    static id = 'even-the-odds';

    override setupCardAbilities() {
        this.action('Move a character to the conflict')
            .condition(() => !!this.game.currentConflict)
            .ifCondition((context) => !!context.player.opponent && !!this.game.currentConflict?.hasMoreParticipants(context.player.opponent))
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, moveToConflict(), honor((context) => ({ target: context.target?.hasTrait(Trait.Commander) ? context.target : [] })));
    }
}


export default EvenTheOdds;
