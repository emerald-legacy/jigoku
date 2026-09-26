import AbilityDsl from '../../../abilitydsl.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

export default class ThereAreNoSecrets extends DrawCard {
    static id = 'there-are-no-secrets';

    setupCardAbilities() {
        this.wouldInterrupt('Gain 1 fate')
            .when({
                onMoveFate: (event, context) =>
                    context.source.parentCharacter && event.origin === context.source.parentCharacter && (event.fate ?? 0) > 0
            })
            .gameAction(AbilityDsl.actions.gainFate((context) => ({ target: context.player })));
    }

    canPlay(context: TriggeredAbilityContext, playType: string) {
        return (
            context.player.cardsInPlay.some(
                (card: DrawCard) => card.getType() === CardType.Character && card.hasTrait('shugenja')
            ) && super.canPlay(context, playType)
        );
    }
}
