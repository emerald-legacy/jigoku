import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardTypes } from '../../Constants.js';

class EvenTheOdds extends DrawCard {
    static id = 'even-the-odds';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Move a character to the conflict',
            condition: (context) =>
                this.game.isDuringConflict() &&
                !!this.game.currentConflict &&
                !!context.player.opponent &&
                this.game.currentConflict.hasMoreParticipants(context.player.opponent, () => true),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: [
                    AbilityDsl.actions.moveToConflict(),
                    AbilityDsl.actions.honor<DrawCard>((context) => ({ target: context.target?.hasTrait('commander') ? context.target : [] }))
                ]
            }
        });
    }
}


export default EvenTheOdds;
