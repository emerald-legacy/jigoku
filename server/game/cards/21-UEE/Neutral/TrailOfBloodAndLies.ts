import { msg } from '../../../GameChat.js';
import { perPhase } from '../../../AbilityLimit.js';
import { dishonor, selectCard } from '../../../GameActions/GameActions.js';
import { CardType, Phase, Players, Trait } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class TrailOfBloodAndLies extends DrawCard {
    static id = 'trail-of-blood-and-lies';

    override setupCardAbilities() {
        this.reaction('Dishonor a character')
            .when({
                onMoveFate: (event, context) => {
                    const origin = event.origin;
                    return (
                        context.game.currentPhase !== Phase.Fate &&
                        (event.fate ?? 0) > 0 &&
                        !!origin?.isCard() &&
                        origin.type === CardType.Character &&
                        origin.controller === context.player.opponent
                    );
                }
            })
            .gameAction(selectCard({
                cardType: CardType.Character,
                player: Players.Opponent,
                controller: Players.Opponent,
                targets: true,
                message: (context, card) => msg`${context.player.opponent ?? ''} chooses to dishonor ${card}`,
                gameAction: dishonor()
            }))
            .chatText((context) => msg`force ${context.player.opponent ?? ''} to dishonor a character`)
            .max(perPhase(1))
            .mayResolveAgain({ condition: (context) => context.player.isCharacterTraitInPlay(Trait.Magistrate) });
    }
}
