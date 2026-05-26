import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, Phases, Players } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';

export default class TrailOfBloodAndLies extends DrawCard {
    static id = 'trail-of-blood-and-lies';

    setupCardAbilities() {
        this.reaction({
            title: 'Dishonor a character',
            when: {
                onMoveFate: (event, context) => {
                    const origin = event.origin as { type?: string; controller?: unknown } | undefined;
                    return (
                        context.game.currentPhase !== Phases.Fate &&
                        event.fate > 0 &&
                        !!origin &&
                        origin.type === CardTypes.Character &&
                        origin.controller === context.player.opponent
                    );
                }
            },
            target: {
                cardType: CardTypes.Character,
                player: Players.Opponent,
                controller: Players.Opponent,
                gameAction: AbilityDsl.actions.dishonor()
            },
            then: () => ({
                gameAction: AbilityDsl.actions.conditional({
                    condition: (context) => context.player.isCharacterTraitInPlay('magistrate'),
                    falseGameAction: AbilityDsl.actions.noAction(),
                    trueGameAction: AbilityDsl.actions.selectCard({
                        activePromptTitle: 'Choose a character to dishonor',
                        cardType: CardTypes.Character,
                        player: Players.Opponent,
                        controller: Players.Opponent,
                        gameAction: AbilityDsl.actions.dishonor()
                    })
                })
            }),
            max: AbilityDsl.limit.perPhase(1)
        });
    }
}
