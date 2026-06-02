import { CardType, PlayType, Players, TargetMode } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class ShosuroMiyako extends DrawCard {
    static id = 'shosuro-miyako';

    public setupCardAbilities() {
        this.reaction({
            title: 'Opponent discards or dishonors',
            when: {
                onCardPlayed: (event, context) =>
                    event.player === context.player &&
                    event.playType === PlayType.PlayFromHand &&
                    event.card.type === CardType.Character &&
                    context.player.opponent !== undefined
            },
            target: {
                mode: TargetMode.Select,
                player: Players.Opponent,
                choices: {
                    'Discard at random': AbilityDsl.actions.discardAtRandom(),
                    'Dishonor a character': AbilityDsl.actions.selectCard((context) => ({
                        activePromptTitle: 'Choose a character to dishonor',
                        player: Players.Opponent,
                        controller: Players.Opponent,
                        targets: true,
                        message: '{0} chooses to dishonor {1}',
                        messageArgs: (card) => [context.player.opponent, card],
                        gameAction: AbilityDsl.actions.dishonor()
                    }))
                }
            },
            effect: 'force {1} to {2}',
            effectArgs: (context) => [context.player.opponent ?? '', context.select.toLowerCase()]
        });
    }
}
