import DrawCard from '../../DrawCard.js';
import { perConflict } from '../../AbilityLimit.js';
import { dishonor, honor, selectCard } from '../../GameActions/GameActions.js';
import { Players, CardType, ConflictType } from '../../Constants.js';

class CourtGames extends DrawCard {
    static id = 'court-games';

    setupCardAbilities() {
        this.conflictAction('Honor or dishonor a character', { conflictType: ConflictType.Political })
            .select({}, {
                'Honor a friendly character': selectCard((context) => ({
                    cardType: CardType.Character,
                    controller: Players.Self,
                    targets: true,
                    cardCondition: (card) => card.isCharacter() && card.isParticipating(),
                    message: '{0} chooses to honor {1}',
                    messageArgs: (card) => [context.player, card],
                    gameAction: honor()
                })),
                'Dishonor an opposing character': selectCard((context) => ({
                    player: Players.Opponent,
                    cardType: CardType.Character,
                    controller: Players.Opponent,
                    targets: true,
                    cardCondition: (card) => card.isCharacter() && card.isParticipating(),
                    message: '{0} chooses to dishonor {1}',
                    messageArgs: (card) => [context.player.opponent, card],
                    gameAction: dishonor()
                }))
            })
            .chatText('{1}', (context) => context.select.toLowerCase())
            .max(perConflict(1));
    }
}


export default CourtGames;

