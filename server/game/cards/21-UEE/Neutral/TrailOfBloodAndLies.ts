import { perPhase } from '../../../AbilityLimit.js';
import { dishonor } from '../../../GameActions/GameActions.js';
import { CardType, Phase, Players } from '../../../Constants.js';
import BaseCard from '../../../BaseCard.js';
import DrawCard from '../../../DrawCard.js';

export default class TrailOfBloodAndLies extends DrawCard {
    static id = 'trail-of-blood-and-lies';

    setupCardAbilities() {
        this.reaction('Dishonor a character')
            .when({
                onMoveFate: (event, context) => {
                    const origin = event.origin;
                    return (
                        context.game.currentPhase !== Phase.Fate &&
                        (event.fate ?? 0) > 0 &&
                        origin instanceof BaseCard &&
                        origin.type === CardType.Character &&
                        origin.controller === context.player.opponent
                    );
                }
            })
            .target({
                cardType: CardType.Character,
                player: Players.Opponent,
                controller: Players.Opponent
            }, dishonor())
            .max(perPhase(1))
            .mayResolveAgain({ condition: (context) => context.player.isCharacterTraitInPlay('magistrate') });
    }
}
