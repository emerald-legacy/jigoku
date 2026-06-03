import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, TargetMode, CardType } from '../../Constants.js';

class CourtGames extends DrawCard {
    static id = 'court-games';

    setupCardAbilities() {
        this.action({
            title: 'Honor or dishonor a character',
            condition: () => this.game.currentConflict?.conflictType === 'political',
            max: AbilityDsl.limit.perConflict(1),
            target: {
                mode: TargetMode.Select,
                choices: {
                    'Honor a friendly character': AbilityDsl.actions.selectCard(context => ({
                        cardType: CardType.Character,
                        controller: Players.Self,
                        targets: true,
                        cardCondition: card => card.isParticipating(),
                        message: '{0} chooses to honor {1}',
                        messageArgs: card => [context.player, card],
                        gameAction: AbilityDsl.actions.honor()
                    })),
                    'Dishonor an opposing character': AbilityDsl.actions.selectCard(context => ({
                        player: Players.Opponent,
                        cardType: CardType.Character,
                        controller: Players.Opponent,
                        targets: true,
                        cardCondition: card => card.isParticipating(),
                        message: '{0} chooses to dishonor {1}',
                        messageArgs: card => [context.player.opponent, card],
                        gameAction: AbilityDsl.actions.dishonor()
                    }))
                }
            },
            effect: '{1}',
            effectArgs: context => context.select.toLowerCase()
        });
    }
}


export default CourtGames;

