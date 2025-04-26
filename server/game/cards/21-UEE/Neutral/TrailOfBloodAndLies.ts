import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Phases, Players } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class TrailOfBloodAndLies extends DrawCard {
    static id = 'trail-of-blood-and-lies';

    setupCardAbilities() {
        this.reaction({
            title: 'Dishonor a character',
            when: {
                onMoveFate: (event, context) =>
                    context.game.currentPhase !== Phases.Fate &&
                    event.origin &&
                    event.origin.type === CardTypes.Character &&
                    event.fate > 0
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
