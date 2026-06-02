import DrawCard from '../../DrawCard.js';
import { CardType, Phases, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class WardenOfTheDamned extends DrawCard {
    static id = 'warden-of-the-damned';

    setupCardAbilities() {
        this.forcedInterrupt({
            title: 'Each player sacrifices a dishonored character',
            when: {
                onPhaseEnded: event => event.phase === Phases.Conflict
            },
            effect: 'force both players to sacrifice a dishonored character',
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.selectCard(context => ({
                    activePromptTitle: 'Choose a character to sacrifice',
                    cardType: CardType.Character,
                    controller: context.player.firstPlayer ? Players.Self : Players.Opponent,
                    player: context.player.firstPlayer ? Players.Self : Players.Opponent,
                    cardCondition: card => card.isDishonored,
                    gameAction: AbilityDsl.actions.sacrifice()
                })),
                AbilityDsl.actions.selectCard(context => ({
                    activePromptTitle: 'Choose a character to sacrifice',
                    cardType: CardType.Character,
                    controller: context.player.firstPlayer ? Players.Opponent : Players.Self,
                    player: context.player.firstPlayer ? Players.Opponent : Players.Self,
                    cardCondition: card => card.isDishonored,
                    gameAction: AbilityDsl.actions.sacrifice()
                }))
            ])
        });
    }
}


export default WardenOfTheDamned;
